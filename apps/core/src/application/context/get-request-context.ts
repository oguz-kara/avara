import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RequestContext } from './request-context'

export const getRequestContextFrom = (ctx: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(ctx).getContext()
  return new RequestContext({
    channel: gqlContext.channel,
    channelId: gqlContext.channelId,
    channelCode: gqlContext.channelCode,
    languageCode: gqlContext.languageCode,
    currencyCode: gqlContext.currencyCode,
  })
}
