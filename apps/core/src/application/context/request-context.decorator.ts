import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const Ctx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if ((ctx.getType() as string) === 'graphql')
      return GqlExecutionContext.create(ctx).getContext().context

    const req = ctx.switchToHttp().getRequest()
    return req.context
  },
)
