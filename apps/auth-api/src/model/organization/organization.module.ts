import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtOrgStrategy, JwtStrategy } from '@repo/nest-auth-module';
import { TransactionService } from '@repo/nest-mongo-database';
import {
  Organization,
  OrganizationRepository,
  OrganizationSchema,
  OrganizationService,
} from '@repo/nest-organization-module';
import * as Joi from 'joi';

import { OrganizationMemberModule } from '../organization-member/organization-member.module';
import { OrganizationRoleModule } from '../organization-role/organization-role.module';
import { UserModule } from '../user/user.module';
import { OrganizationController } from './organization.controller';

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
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
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
    OrganizationMemberModule,
    OrganizationRoleModule,
    UserModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
    JwtStrategy,
    JwtOrgStrategy,
    TransactionService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
