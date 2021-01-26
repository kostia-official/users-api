import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  await app.listen(port);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
