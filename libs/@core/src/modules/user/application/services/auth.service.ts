import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from '../../infrastructure/services/password.service'
import { RegisterUserDto } from '../graphql/dto/register-user.dto'
import { LoginUserDto } from '../graphql/dto/login-user.dto'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'
import { Permission } from '@avara/shared/enums/permission'
import { User } from '../../domain/entities/user.entity'
import { RequestContext } from '@avara/core/context/request-context'
import { CoreRepositories } from '@avara/core/core-repositories'

@Injectable()
export class AuthService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly pwService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    ctx: RequestContext,
    email: string,
    password: string,
  ): Promise<User | null> {
    const userRepo = this.repositories.get(ctx, 'User')

    const user = await userRepo.findByEmail(email)
    if (
      user &&
      (await this.pwService.validatePassword(password, user.password_hash))
    ) {
      return user
    }
    return null
  }

  async createUserAccount(
    ctx: RequestContext,
    { email, password, role_id, is_active }: RegisterUserDto,
  ): Promise<CreateUserAccountSuccess> {
    const userRepo = this.repositories.get(ctx, 'User')
    const roleRepo = this.repositories.get(ctx, 'Role')

    if (await userRepo.findByEmail(email)) {
      throw new ConflictException(`User with email ${email} already exists.`)
    }

    const role = await roleRepo.findOneInChannel(role_id)
    if (!role) throw new NotFoundException(`Role with ID ${role_id} not found.`)

    const passwordHash = await this.pwService.hashPassword(password)
    const newUser = new User({
      password_hash: passwordHash,
      email,
      role_id,
      is_active,
    })
    await userRepo.save(newUser)

    return newUser as CreateUserAccountSuccess
  }

  async authenticateUser(
    ctx: RequestContext,
    { email, password }: LoginUserDto,
  ): Promise<AuthenticateUserSuccess> {
    const user = await this.validateUser(ctx, email, password)
    if (!user) throw new ConflictException('Invalid credentials!')

    const token = this.signToken(user.id, user.email)
    return { token }
  }

  signToken(userId: string, email: string): string {
    const payload = { user_id: userId, email }
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('authentication.jwt.expiresIn'),
    })
  }

  async isAuthorizedToPerformAction(
    ctx: RequestContext,
    userId: string,
    requiredPermissions: Permission[],
    operator: 'OR' | 'AND',
  ): Promise<boolean> {
    const userRepo = this.repositories.get(ctx, 'User')
    const permissionRepo = this.repositories.get(ctx, 'Permission')
    const user = await userRepo.findById(userId)
    if (!user) throw new ConflictException('User not found!')

    const permissions = await permissionRepo.getPermissionsByRoleId(
      user.role_id,
    )
    const permissionNames = permissions.map(
      (permission) => permission.name,
    ) as Permission[]

    if (operator === 'OR') {
      return requiredPermissions.some((permission) =>
        permissionNames.includes(permission),
      )
    } else {
      return requiredPermissions.every((permission) =>
        permissionNames.includes(permission),
      )
    }
  }

  async findUserById(
    ctx: RequestContext,
    userId: string,
  ): Promise<User | null> {
    const userRepo = this.repositories.get(ctx, 'User')

    return userRepo.findById(userId)
  }
}
