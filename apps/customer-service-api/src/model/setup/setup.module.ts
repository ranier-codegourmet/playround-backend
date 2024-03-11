import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtCSOrgStrategy } from '@repo/nest-auth-module';
import * as Joi from 'joi';

import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${
        process.env.NODE_ENV === 'test' ? '.test' : ''
      }`,
      validationSchema: Joi.object({
        AUTH_PUBLIC_KEY: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    OrganizationModule,
    UserModule,
  ],
  providers: [SetupService, JwtCSOrgStrategy],
  controllers: [SetupController],
})
export class SetupModule {}
