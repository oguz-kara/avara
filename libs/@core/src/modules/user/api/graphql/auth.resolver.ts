import { UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UserType } from '@avara/core/modules/user/infrastructure/graphql/user.graphql'
import { Permission } from '@avara/shared/enums/permission'
import { Allow } from '@avara/shared/decorators/allow'
import { SetJwtCookieInterceptor } from '@avara/core/interceptors/set-jwt-cookie'
import { AuthService } from '../../application/services/auth.service'
import { LoginUserDto } from '../../application/graphql/dto/login-user.dto'
import { RegisterUserDto } from '../../application/graphql/dto/register-user.dto'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly userAuthService: AuthService) {}

  @Mutation(() => AuthenticateUserSuccess)
  @UseInterceptors(SetJwtCookieInterceptor)
  async authenticateUser(@Args('input') input: LoginUserDto) {
    return await this.userAuthService.authenticateUser(input)
  }

  @Allow(Permission.UPDATE_USER_GLOBAL, Permission.WRITE_USER_GLOBAL)
  @Mutation(() => CreateUserAccountSuccess)
  async createUserAccount(@Args('input') input: RegisterUserDto) {
    return await this.userAuthService.createUserAccount(input)
  }
}
