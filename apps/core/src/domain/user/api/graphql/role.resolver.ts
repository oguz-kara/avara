import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import {
  CreateRoleResponse,
  FindRolesResponseType,
  Role,
} from '@avara/core/domain/user/infrastructure/graphql/role.graphql'
import {
  CreateRoleDto,
  RenameRoleDto,
  SetRolePermissionsDto,
} from '@avara/core/domain/user/application/graphql/dto/role.dto'
import { RoleService } from '@avara/core/domain/user/application/services/role.service'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { NameInput } from '@avara/core/domain/user/application/graphql/input/name.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { Ctx } from '@avara/core/application/context/request-context.decorator'
import { RequestContext } from '@avara/core/application/context/request-context'

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Allow(Permission.CREATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => CreateRoleResponse)
  async createRole(
    @Ctx() ctx: RequestContext,
    @Args('input') createUserInput: CreateRoleDto,
  ) {
    const role = await this.roleService.createRole(ctx, createUserInput)

    return role
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async renameRoleById(
    @Ctx() ctx: RequestContext,
    @Args('input') renameRoleInput: RenameRoleDto,
  ) {
    const role = await this.roleService.renameRoleById(
      ctx,
      renameRoleInput.id,
      renameRoleInput.name,
    )

    return role
  }

  @Allow(Permission.DELETE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async removeRoleById(
    @Ctx() ctx: RequestContext,
    @Args('input') removeRoleInput: IDInput,
  ) {
    const role = await this.roleService.removeRoleById(ctx, removeRoleInput.id)

    return role
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => FindRolesResponseType)
  async roles(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const rolesData = await this.roleService.findMany(ctx, pagination)

    return rolesData
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => Role, { nullable: true })
  async findRoleById(
    @Ctx() ctx: RequestContext,
    @Args('input') findRoleInput: IDInput,
  ) {
    const { id } = findRoleInput
    const role = await this.roleService.findById(ctx, id)

    return role
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => Role, { nullable: true })
  async findRoleByName(
    @Ctx() ctx: RequestContext,
    @Args('input') findRoleInput: NameInput,
  ) {
    const { name } = findRoleInput
    const role = await this.roleService.findByName(ctx, name)

    return role
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async setRolePermissions(
    @Ctx() ctx: RequestContext,
    @Args('input') setRolePermissionsInput: SetRolePermissionsDto,
  ) {
    const role = await this.roleService.setPermissions(
      ctx,
      setRolePermissionsInput.roleId,
      setRolePermissionsInput.permissionIds,
    )

    return role
  }
}
