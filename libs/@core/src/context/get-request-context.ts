import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RequestContext } from './request-context'

export const getRequestContextFrom = (ctx: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(ctx).getContext()
  return new RequestContext({
    channel: gqlContext.channel,
    channel_id: gqlContext.channel_id,
    channel_code: gqlContext.channel_code,
    language_code: gqlContext.language_code,
    currency_code: gqlContext.currency_code,
  })
}
