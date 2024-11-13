import { NestFactory } from '@nestjs/core';
import { UilocalizeModule } from './uilocalize.module';

async function bootstrap() {
  const app = await NestFactory.create(UilocalizeModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
