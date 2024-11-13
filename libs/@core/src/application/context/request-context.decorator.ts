import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getRequestContextFrom } from './get-request-context'

export const Ctx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if ((ctx.getType() as string) === 'graphql')
      return getRequestContextFrom(ctx)

    const req = ctx.switchToHttp().getRequest()
    return req.context
  },
)
