import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Customer Service API');
  logger.log('Starting Customer Service API...');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (configService.get('NODE_ENV') === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Customer Service API')
      .setDescription('The Customer Service API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api', app, document);
  }

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
