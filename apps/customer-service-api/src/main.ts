import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Customer Service API');
  logger.log('Starting Customer Service API...');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.enableCors();

  await app.listen(configService.get('PORT'));

  logger.log(`Customer Service API is running on: ${await app.getUrl()}`);
}
bootstrap();
