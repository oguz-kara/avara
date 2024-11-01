import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@avara/core/modules/user/application/services/user.service'
import { Permission } from '../enums/permission'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token: string | undefined = undefined
    let payload: { user_id: string } | undefined = undefined
    const authType = this.configService.get('authOptions.strategy')

    // Retrieve permission metadata
    const permissionData = this.reflector.get<{
      items: Permission[]
      operator: 'OR' | 'AND'
    }>('permissionData', context.getHandler())

    if (!permissionData) return true

    const { items: requiredPermissions, operator } = permissionData

    if (!requiredPermissions) return true

    if (authType === 'cookie') {
      token = this.extractJwtFromCookie(context)
    } else if (authType === 'bearer') {
      token = this.extractJwtFromAuthorizationHeader(context)
    }

    console.log({ token })

    if (!token) {
      throw new UnauthorizedException(
        'Authorization token is missing or invalid',
      )
    }

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      }) as { user_id: string }
    } catch (error) {
      this.handleJWTErrorByName(error.name)
    }

    const req = this.getRequest(context)
    req.user = payload

    const userPermissions = await this.userService.retrieveUserPermissions(
      payload.user_id,
    )

    if (operator === 'OR') {
      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      )

      if (!hasPermission) throw new ForbiddenException('Access denied')
      return true
    } else {
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      )

      if (!hasPermission) throw new ForbiddenException('Access denied')
      return true
    }
  }

  private extractJwtFromCookie(context: ExecutionContext): string | undefined {
    const isGraphQL = (context.getType() as string) === 'graphql'

    if (isGraphQL) {
      const gqlContext = GqlExecutionContext.create(context).getContext()
      return gqlContext.req?.cookies?.jwt
    } else {
      const req = context.switchToHttp().getRequest()
      return req?.cookies?.jwt
    }
  }

  private extractJwtFromAuthorizationHeader(
    context: ExecutionContext,
  ): string | undefined {
    const isGraphQL = (context.getType() as string) === 'graphql'

    if (isGraphQL) {
      const gqlContext = GqlExecutionContext.create(context).getContext()
      const authHeader = gqlContext.req?.headers?.authorization
      console.log({ authHeader })
      return this.extractTokenFromAuthHeader(authHeader)
    } else {
      const req = context.switchToHttp().getRequest()
      const authHeader = req?.headers?.authorization
      return this.extractTokenFromAuthHeader(authHeader)
    }
  }

  private extractTokenFromAuthHeader(
    authHeader: string | undefined,
  ): string | undefined {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined
    }
    return authHeader.split(' ')[1] // Extract the token part
  }

  private getRequest(context: ExecutionContext) {
    const isGraphQL = (context.getType() as string) === 'graphql'

    if (isGraphQL) {
      return GqlExecutionContext.create(context).getContext().req
    } else {
      return context.switchToHttp().getRequest()
    }
  }

  private handleJWTErrorByName(errorName: string) {
    if (errorName === 'TokenExpiredError') {
      throw new UnauthorizedException('JWT token is expired')
    } else if (errorName === 'JsonWebTokenError') {
      throw new UnauthorizedException('JWT token is malformed')
    } else {
      throw new UnauthorizedException('JWT token verification failed')
    }
  }
}
