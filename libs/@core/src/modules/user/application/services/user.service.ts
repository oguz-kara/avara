import { User } from '../../domain/entities/user.entity'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from '../graphql/dto/user.dto'
import { PaginationUtils } from '../../../../../../@shared/src/utils/pagination.util'
import { Permission } from '@avara/shared/enums/permission'
import { CoreRepositories } from '@avara/core/core-repositories'
import { RequestContext } from '@avara/core/context/request-context'

@Injectable()
export class UserService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async getUserById(ctx: RequestContext, id: string): Promise<User | null> {
    const userRepo = this.repositories.get(ctx, 'User')
    const user = await userRepo.findById(id)

    return user
  }

  async getUserByEmail(
    ctx: RequestContext,
    email: string,
  ): Promise<User | null> {
    const userRepo = this.repositories.get(ctx, 'User')

    const user = await userRepo.findByEmail(email)

    return user
  }

  async getUsersWithPagination(
    ctx: RequestContext,
    params: PaginationParams,
  ): Promise<PaginatedItemsResponse<User>> {
    const userRepo = this.repositories.get(ctx, 'User')

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const user = await userRepo.findAll({
      limit,
      position,
    })

    return user
  }

  async setUserEmail(ctx: RequestContext, id: string, email: string) {
    const userRepo = this.repositories.get(ctx, 'User')

    const user = await userRepo.findById(id)

    if (!user) throw new NotFoundException('User not found!')

    user.changeEmail(email)

    await userRepo.save(user)

    return user
  }

  async getUserPermissionsByUserId(ctx: RequestContext, userId: string) {
    const userRepo = this.repositories.get(ctx, 'User')
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const user = await userRepo.findById(userId)

    if (!user) throw new ConflictException('User not found!')

    const permissions = await permissionRepo.getPermissionsByRoleId(
      user.role_id,
    )

    return permissions.map((permission) => permission.name) as Permission[]
  }

  async saveNewUser(ctx: RequestContext, user: CreateUserDto) {
    const userRepo = this.repositories.get(ctx, 'User')
    const roleRepo = this.repositories.get(ctx, 'Role')

    const existedUser = await userRepo.findByEmail(user.email)

    if (existedUser) throw new ConflictException('User already exists!')

    const role = await roleRepo.findOneInChannel(user.role_id)

    if (!role) throw new NotFoundException('User role not found to assign!')

    const createdUser = new User({
      id: undefined,
      email: user.email,
      password_hash: user.password,
      email_verified: user.email_verified,
      role_id: user.role_id,
      is_active: user.is_active,
    })

    await userRepo.save(createdUser)

    return createdUser
  }

  async setUserRole(ctx: RequestContext, userId: string, roleId: string) {
    const userRepo = this.repositories.get(ctx, 'User')
    const roleRepo = this.repositories.get(ctx, 'Role')

    const user = await userRepo.findById(userId)

    if (!user) throw new NotFoundException('User not found to assign role!')

    const role = await roleRepo.findOneInChannel(roleId)

    if (!role) throw new NotFoundException('Role not found to assign to user!')

    user.setRole(role.id)

    await userRepo.save(user)

    return user
  }
}
