import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import {
  CreateRoleResponse,
  FindRolesResponseType,
  Role,
} from '@avara/core/modules/user/infrastructure/graphql/role.graphql'
import {
  CreateRoleDto,
  RenameRoleDto,
  SetRolePermissionsDto,
} from '@avara/core/modules/user/application/graphql/dto/role.dto'
import { RoleService } from '@avara/core/modules/user/application/services/role.service'
import { IDInput } from '@avara/core/modules/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/core/modules/user/application/graphql/input/pagination-params.input'
import { NameInput } from '@avara/core/modules/user/application/graphql/input/name.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Allow(Permission.CREATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => CreateRoleResponse)
  async createRole(@Args('input') createUserInput: CreateRoleDto) {
    const role = await this.roleService.createRole(createUserInput)

    return role
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async renameRoleById(@Args('input') renameRoleInput: RenameRoleDto) {
    const role = await this.roleService.renameRoleById(
      renameRoleInput.id,
      renameRoleInput.name,
    )

    return role
  }

  @Allow(Permission.DELETE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async removeRoleById(@Args('input') removeRoleInput: IDInput) {
    const role = await this.roleService.removeRoleById(removeRoleInput.id)

    return role
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => FindRolesResponseType)
  async findRoles(
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const rolesData = await this.roleService.findMany(pagination)

    return rolesData
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => Role, { nullable: true })
  async findRoleById(@Args('input') findRoleInput: IDInput) {
    const { id } = findRoleInput
    const role = await this.roleService.findById(id)

    return role
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => Role, { nullable: true })
  async findRoleByName(@Args('input') findRoleInput: NameInput) {
    const { name } = findRoleInput
    const role = await this.roleService.findByName(name)

    return role
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async setRolePermissions(
    @Args('input') setRolePermissionsInput: SetRolePermissionsDto,
  ) {
    const role = await this.roleService.setPermissions(
      setRolePermissionsInput.roleId,
      setRolePermissionsInput.permissionIds,
    )

    return role
  }
}
