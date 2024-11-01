import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UserType } from '@avara/core/modules/user/infrastructure/graphql/user.graphql'
import { UserAuthService } from '../../application/services/user-auth.service'
import { LoginUserDto } from '../../application/graphql/dto/login-user.dto'
import { RegisterUserDto } from '../../application/graphql/dto/register-user.dto'
import { UseInterceptors } from '@nestjs/common'
import { SetJwtCookieInterceptor } from '@avara/core/interceptors/set-jwt-cookie'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'

@Resolver(() => UserType)
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Mutation(() => AuthenticateUserSuccess)
  @UseInterceptors(SetJwtCookieInterceptor)
  async authenticateUser(@Args('input') input: LoginUserDto) {
    return await this.userAuthService.authenticateUser(input)
  }

  @Mutation(() => CreateUserAccountSuccess)
  async createUserAccount(@Args('input') input: RegisterUserDto) {
    return await this.userAuthService.createUserAccount(input)
  }
}
