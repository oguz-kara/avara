import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  FindUsersResponseType,
  UserType,
} from '@avara/core/modules/user/infrastructure/graphql/user.graphql'
import {
  AssignRoleInput,
  CreateUserArgs,
} from '@avara/core/modules/user/application/graphql/dto/user.dto'
import { UserService } from '@avara/core/modules/user/application/services/user.service'
import { PaginationParamsInput } from '@avara/core/modules/user/application/graphql/input/pagination-params.input'
import { IDInput } from '@avara/core/modules/user/application/graphql/input/id.input'
import { EmailInput } from '@avara/core/modules/user/application/graphql/input/email.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserType)
  async createUser(
    @Args({ type: () => CreateUserArgs }) { input }: CreateUserArgs,
  ) {
    const user = await this.userService.addNewUser(input)

    return user
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => FindUsersResponseType)
  async users(
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const userData = await this.userService.retrievePaginatedUsers(pagination)

    return userData
  }

  @Query(() => UserType, { nullable: true })
  async findUserById(@Args('input') findUserInput: IDInput) {
    const { id } = findUserInput
    const user = await this.userService.retrieveUserById(id)

    return user
  }

  @Query(() => UserType, { nullable: true })
  async findUserByEmail(@Args('input') findUserInput: EmailInput) {
    const { email } = findUserInput
    const user = await this.userService.retrieveUserByEmail(email)

    return user
  }

  @Mutation(() => UserType)
  async assignRoleToUser(@Args('input') assignRoleInput: AssignRoleInput) {
    const { roleId, userId } = assignRoleInput

    const user = await this.userService.assignUserRole(userId, roleId)

    return user
  }
}
