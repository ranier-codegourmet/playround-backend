import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@repo/nest-auth-module';
import * as Joi from 'joi';

import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    UserModule,
    OrganizationModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env${
            process.env.NODE_ENV === 'test' ? '.test' : ''
          }`,
          validationSchema: Joi.object({
            AUTH_PRIVATE_KEY: Joi.string().required(),
            EXPIRES_IN: Joi.string().required(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get('AUTH_PRIVATE_KEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN'),
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
