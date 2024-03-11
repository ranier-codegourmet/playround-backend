import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseModule } from '@repo/nest-mongo-database';
import * as Joi from 'joi';

import { AuthModule } from './model/auth/auth.module';
import { OrganizationModule } from './model/organization/organization.module';
import { SetupModule } from './model/setup/setup.module';

@Module({
  imports: [
    MongoDatabaseModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${
        process.env.NODE_ENV === 'test' ? '.test' : ''
      }`,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
    OrganizationModule,
    SetupModule,
  ],
})
export class AppModule {}
