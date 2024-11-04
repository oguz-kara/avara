import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PasswordService } from '../../infrastructure/services/password.service'
import { User } from '../../domain/entities/user.entity'
import { UserRepository } from '../../infrastructure/orm/repository/user.repository'
import { RoleRepository } from '../../infrastructure/orm/repository/role.repository'
import { LoginUserDto } from '../graphql/dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { RegisterUserDto } from '../graphql/dto/register-user.dto'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'
import { Permission } from '@avara/shared/enums/permission'
import { PermissionRepository } from '../../infrastructure/orm/repository/permission.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly pwService: PasswordService,
    private readonly permissionRepo: PermissionRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email)
    const isPasswordValid = await this.pwService.validatePassword(
      password,
      user.password_hash,
    )

    if (user && isPasswordValid) {
      return user
    }

    return null
  }

  async createUserAccount({
    email,
    password,
    role_id,
    is_active,
  }: RegisterUserDto): Promise<CreateUserAccountSuccess> {
    const user = await this.userRepo.findByEmail(email)

    if (user)
      throw new ConflictException(`User with email ${email} already exists.`)

    const role = await this.roleRepo.findById(role_id)

    if (!role) throw new NotFoundException(`Role with ID ${role_id} not found.`)

    const passwordHash = await this.pwService.hashPassword(password)

    const newUser = new User({
      password_hash: passwordHash,
      email,
      role_id,
      is_active,
    })

    await this.userRepo.save(newUser)

    return newUser as CreateUserAccountSuccess
  }

  async authenticateUser({
    email,
    password,
  }: LoginUserDto): Promise<AuthenticateUserSuccess> {
    const jwtExpiresIn = this.configService.get('authOptions.jwtExpiresIn')
    const user = await this.validateUser(email, password)

    if (!user) throw new ConflictException('Invalid credentials!')

    const payload = { user_id: user.id, email: user.email }

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: jwtExpiresIn,
    })

    return {
      token,
    }
  }

  async isAuthorizedToPerformAction(
    userId: string,
    requiredPermissions: Permission[],
    operator: 'OR' | 'AND',
  ) {
    const user = await this.userRepo.findById(userId)

    if (!user) throw new ConflictException('User not found!')

    const permissions = await this.permissionRepo.getPermissionsByRoleId(
      user.role_id,
    )

    const permissionNames = permissions.map(
      (permission) => permission.name,
    ) as Permission[]

    if (operator === 'OR') {
      const hasPermission = requiredPermissions.some((permission) =>
        permissionNames.includes(permission),
      )

      if (!hasPermission) throw new ConflictException('Access denied!')
      return true
    }

    const hasPermission = requiredPermissions.every((permission) =>
      permissionNames.includes(permission),
    )

    if (!hasPermission) throw new ConflictException('Access denied!')
    return true
  }
}
