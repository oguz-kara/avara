import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserService } from '../../application/services/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const strategy = this.configService.get<string>('authOptions.strategy')

        if (strategy === 'bearer') {
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
        } else if (strategy === 'cookie') {
          return req?.cookies?.accessToken || null
        }
        return null
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: { sub: string }) {
    return this.userService.getUserById(payload.sub)
  }
}
