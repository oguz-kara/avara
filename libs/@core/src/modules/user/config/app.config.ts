import { ConfigFactory, ConfigObject } from '@nestjs/config'

export const appConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  apiOptions: {
    hostname: 'localhost',
    port: 3000,
    protectedApiPath: '/back',
    frontApiPath: '/front',
  },
  paginationOptions: {
    maxLimit: 100,
    defaultLimit: 25,
    defaultPosition: 0,
  },
  authOptions: {
    strategy: 'bearer',
  },
})
