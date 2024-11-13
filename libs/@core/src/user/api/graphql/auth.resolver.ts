import { UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UserType } from '@avara/core/user/infrastructure/graphql/user.graphql'
import { SetJwtCookieInterceptor } from '@avara/core/application/interceptors/set-jwt-cookie'
import { AuthService } from '../../application/services/auth.service'
import { LoginUserDto } from '../../application/graphql/dto/login-user.dto'
import { RegisterUserDto } from '../../application/graphql/dto/register-user.dto'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Ctx } from '@avara/core/application/context/request-context.decorator'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly userAuthService: AuthService) {}

  @Mutation(() => AuthenticateUserSuccess)
  @UseInterceptors(SetJwtCookieInterceptor)
  async authenticateUser(
    @Ctx() ctx: RequestContext,
    @Args('input') input: LoginUserDto,
  ) {
    return await this.userAuthService.authenticateUser(ctx, input)
  }

  // @Allow(Permission.UPDATE_USER_GLOBAL, Permission.WRITE_USER_GLOBAL)
  @Mutation(() => CreateUserAccountSuccess)
  async createUserAccount(
    @Ctx() ctx: RequestContext,
    @Args('input') input: RegisterUserDto,
  ) {
    return await this.userAuthService.createUserAccount(ctx, input)
  }
}
