import { CoreModule } from './core.module'
import { NestFactory } from '@nestjs/core'
import { CustomValidationPipe } from '@avara/shared/pipes/custom-validation-pipe'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, { cors: true })
  app.useGlobalPipes(new CustomValidationPipe())
  app.use(cookieParser())
  await app.listen(3000)
}
bootstrap()
