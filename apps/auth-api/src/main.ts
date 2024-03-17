import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Auth API');
  logger.log('Starting Auth API...');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    })
  );

  app.enableCors();

  await app.listen(configService.get('PORT'));

  logger.log(`Auth API is running on: ${await app.getUrl()}`);
}
bootstrap();
