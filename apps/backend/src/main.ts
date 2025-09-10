import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import ErrorFilter from './shared/error.filter';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
