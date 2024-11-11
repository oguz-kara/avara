import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  AssignSpecificScopeIdInput,
  FindPermissionByNameInput,
  FindPermissionsResponseType,
  Permission as PermissionEntity,
} from '@avara/core/modules/user/infrastructure/graphql/permission.graphql'
import { PermissionService } from '@avara/core/modules/user/application/services/permission.service'
import {
  CreatePermissionDto,
  RenamePermissionDto,
} from '../../application/graphql/dto/permission.dto'
import { IDInput } from '../../application/graphql/input/id.input'
import { PaginationParamsInput } from '../../../../../../@shared/src/graphql/inputs/pagination-params.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { RequestContext } from '@avara/core/context/request-context'
import { Ctx } from '@avara/core/context/request-context.decorator'

@Resolver(() => PermissionEntity)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Allow(
    Permission.CREATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async createPermission(
    @Ctx() ctx: RequestContext,
    @Args('input') createUserInput: CreatePermissionDto,
  ) {
    return await this.permissionService.createPermission(ctx, createUserInput)
  }

  @Allow(
    Permission.UPDATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async renamePermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') renamePermissionInput: RenamePermissionDto,
  ) {
    return await this.permissionService.renamePermissionById(
      ctx,
      renamePermissionInput.id,
      renamePermissionInput.name,
    )
  }

  @Allow(
    Permission.UPDATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async assignSpecificScopeId(
    @Ctx() ctx: RequestContext,
    @Args('input') assignSpecificScopeInput: AssignSpecificScopeIdInput,
  ) {
    return await this.permissionService.assignSpecificScopeId(
      ctx,
      assignSpecificScopeInput.permissionId,
      assignSpecificScopeInput.specificScopeId,
    )
  }

  @Allow(
    Permission.DELETE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async removePermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') removePermissionInput: IDInput,
  ) {
    return await this.permissionService.removePermissionById(
      ctx,
      removePermissionInput.id,
    )
  }

  @Allow(
    Permission.DELETE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async softRemovePermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') removePermissionInput: IDInput,
  ) {
    return await this.permissionService.softRemovePermissionById(
      ctx,
      removePermissionInput.id,
    )
  }

  @Allow(
    Permission.UPDATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async recoverPermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') recoverPermissionInput: IDInput,
  ) {
    return await this.permissionService.recoverPermissionById(
      ctx,
      recoverPermissionInput.id,
    )
  }

  @Allow(Permission.READ_PERMISSION_GLOBAL)
  @Query(() => FindPermissionsResponseType)
  async permissions(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    return await this.permissionService.findMany(ctx, pagination)
  }

  @Allow(Permission.READ_PERMISSION_GLOBAL)
  @Query(() => PermissionEntity, { nullable: true })
  async findPermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') findPermissionInput: IDInput,
  ) {
    const resolverPermission = await this.permissionService.findById(
      ctx,
      findPermissionInput.id,
    )

    return resolverPermission
  }

  @Allow(Permission.READ_PERMISSION_GLOBAL)
  @Query(() => PermissionEntity, { nullable: true })
  async findPermissionByName(
    @Ctx() ctx: RequestContext,
    @Args('input') findPermissionInput: FindPermissionByNameInput,
  ) {
    return await this.permissionService.findByName(
      ctx,
      findPermissionInput.name,
    )
  }
}
