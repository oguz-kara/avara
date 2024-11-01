import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  AssignSpecificScopeIdInput,
  FindPermissionByNameInput,
  FindPermissionsResponseType,
  Permission,
} from '@avara/core/modules/user/infrastructure/graphql/permission.graphql'
import { PermissionService } from '@avara/core/modules/user/application/services/permission.service'
import {
  CreatePermissionDto,
  RenamePermissionDto,
} from '../../application/graphql/dto/permission.dto'
import { IDInput } from '../../application/graphql/input/id.input'
import { PaginationParamsInput } from '../../application/graphql/input/pagination-params.input'

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission)
  async createPermission(@Args('input') createUserInput: CreatePermissionDto) {
    return await this.permissionService.createPermission(createUserInput)
  }

  @Mutation(() => Permission)
  async renamePermissionById(
    @Args('input') renamePermissionInput: RenamePermissionDto,
  ) {
    return await this.permissionService.renamePermissionById(
      renamePermissionInput.id,
      renamePermissionInput.name,
    )
  }

  @Mutation(() => Permission)
  async assignSpecificScopeId(
    @Args('input') assignSpecificScopeInput: AssignSpecificScopeIdInput,
  ) {
    return await this.permissionService.assignSpecificScopeId(
      assignSpecificScopeInput.permissionId,
      assignSpecificScopeInput.specificScopeId,
    )
  }

  @Mutation(() => Permission)
  async removePermissionById(@Args('input') removePermissionInput: IDInput) {
    return await this.permissionService.removePermissionById(
      removePermissionInput.id,
    )
  }

  @Mutation(() => Permission)
  async softRemovePermissionById(
    @Args('input') removePermissionInput: IDInput,
  ) {
    return await this.permissionService.softRemovePermissionById(
      removePermissionInput.id,
    )
  }

  @Mutation(() => Permission)
  async recoverPermissionById(@Args('input') recoverPermissionInput: IDInput) {
    return await this.permissionService.recoverPermissionById(
      recoverPermissionInput.id,
    )
  }

  @Query(() => FindPermissionsResponseType)
  async permissions(
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    return await this.permissionService.findMany(pagination)
  }

  @Query(() => Permission, { nullable: true })
  async findPermissionById(@Args('input') findPermissionInput: IDInput) {
    const resolverPermission = await this.permissionService.findById(
      findPermissionInput.id,
    )

    return resolverPermission
  }

  @Query(() => Permission, { nullable: true })
  async findPermissionByName(
    @Args('input') findPermissionInput: FindPermissionByNameInput,
  ) {
    return await this.permissionService.findByName(findPermissionInput.name)
  }
}
