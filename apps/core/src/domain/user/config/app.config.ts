import { ConfigFactory, ConfigObject } from '@nestjs/config'

export const appConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  server: {
    hostname: 'localhost',
    port: 3000,
    apiPaths: {
      protected: '/protected',
      public: '/public',
    },
  },
  pagination: {
    limits: {
      max: 100,
      default: 25,
    },
    defaultPosition: 0,
  },
  authentication: {
    strategy: process.env.AUTH_STRATEGY,
    jwt: {
      expiresIn: '30s',
    },
    authorizationEnabled:
      process.env.AUTHORIZATION_ENABLED === 'true' ? true : false,
  },
  localization: {
    language: {
      default: 'en',
      available: ['en', 'fr'],
    },
    currency: {
      default: 'USD',
    },
  },
})
