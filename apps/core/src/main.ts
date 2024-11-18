import { CoreModule } from './core.module'
import { NestFactory } from '@nestjs/core'
import { CustomValidationPipe } from '@avara/shared/pipes/custom-validation-pipe'
import { DelegatingExceptionFilter } from '@avara/shared/exception-filter/delegating-exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, { cors: true })
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalFilters(new DelegatingExceptionFilter())

  await app.listen(3000)
}
bootstrap()
