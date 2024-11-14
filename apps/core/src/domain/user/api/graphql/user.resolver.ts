import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  FindUsersResponseType,
  UserType,
} from '@avara/core/domain/user/infrastructure/graphql/user.graphql'
import {
  AssignRoleInput,
  CreateUserArgs,
} from '@avara/core/domain/user/application/graphql/dto/user.dto'
import { UserService } from '@avara/core/domain/user/application/services/user.service'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { EmailInput } from '@avara/core/domain/user/application/graphql/input/email.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Ctx } from '@avara/core/application/context/request-context.decorator'

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Allow(Permission.CREATE_USER_GLOBAL, Permission.WRITE_USER_GLOBAL)
  @Mutation(() => UserType)
  async createUser(
    @Ctx() ctx: RequestContext,
    @Args({ type: () => CreateUserArgs }) { input }: CreateUserArgs,
  ) {
    const user = await this.userService.saveNewUser(ctx, input)

    return user
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => FindUsersResponseType)
  async users(
    @Ctx() ctx: RequestContext,

    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const userData = await this.userService.getUsersWithPagination(
      ctx,
      pagination,
    )

    return userData
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => UserType, { nullable: true })
  async findUserById(
    @Ctx() ctx: RequestContext,
    @Args('input') findUserInput: IDInput,
  ) {
    const { id } = findUserInput
    const user = await this.userService.getUserById(ctx, id)

    return user
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => UserType, { nullable: true })
  async findUserByEmail(
    @Ctx() ctx: RequestContext,
    @Args('input') findUserInput: EmailInput,
  ) {
    const { email } = findUserInput
    const user = await this.userService.getUserByEmail(ctx, email)

    return user
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => UserType)
  async assignRoleToUser(
    @Ctx() ctx: RequestContext,
    @Args('input') assignRoleInput: AssignRoleInput,
  ) {
    const { roleId, userId } = assignRoleInput

    const user = await this.userService.setUserRole(ctx, userId, roleId)

    return user
  }
}
