import { User } from '../../domain/entities/user.entity'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from '../graphql/dto/user.dto'
import { UserRepository } from '../../infrastructure/orm/repository/user.repository'
import { RoleRepository } from '../../infrastructure/orm/repository/role.repository'
import { PaginationUtils } from '../utils/pagination.util'
import { PermissionRepository } from '../../infrastructure/orm/repository/permission.repository'
import { Permission } from '@avara/shared/enums/permission'

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async retrieveUserById(id: string): Promise<User | null> {
    const user = await this.repo.findById(id)

    return user
  }

  async retrieveUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findByEmail(email)

    return user
  }

  async retrievePaginatedUsers(
    params: PaginationParams,
  ): Promise<PaginatedItemsResponse<User>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const user = await this.repo.findAll({
      limit,
      position,
    })

    return user
  }

  async replaceUserEmail(id: string, email: string) {
    const user = await this.repo.findById(id)

    if (!user) throw new NotFoundException('User not found!')

    user.changeEmail(email)

    await this.repo.save(user)

    return user
  }

  async retrieveUserPermissions(userId: string) {
    const user = await this.repo.findById(userId)

    if (!user) throw new ConflictException('User not found!')

    const permissions = await this.permissionRepo.getPermissionsByRoleId(
      user.role_id,
    )

    return permissions.map((permission) => permission.name) as Permission[]
  }

  async addNewUser(user: CreateUserDto) {
    const existedUser = await this.repo.findByEmail(user.email)

    if (existedUser) throw new ConflictException('User already exists!')

    const role = await this.roleRepo.findById(user.role_id)

    if (!role) throw new NotFoundException('User role not found to assign!')

    const createdUser = new User({
      id: undefined,
      email: user.email,
      password_hash: user.password,
      email_verified: user.email_verified,
      role_id: user.role_id,
      is_active: user.is_active,
    })

    await this.repo.save(createdUser)

    return createdUser
  }

  async assignUserRole(userId: string, roleId: string) {
    const user = await this.repo.findById(userId)

    if (!user) throw new NotFoundException('User not found to assign role!')

    const role = await this.roleRepo.findById(roleId)

    if (!role) throw new NotFoundException('Role not found to assign to user!')

    user.setRole(role.id)

    await this.repo.save(user)

    return user
  }
}
