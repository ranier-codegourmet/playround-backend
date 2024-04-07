import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtOrgAuthGuard, JwtOrgStrategy } from '@repo/nest-auth-module';
import * as Joi from 'joi';

import { InventoryModule } from '../inventory/inventory.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse, WarehouseSchema } from './warehouse.schema';
import { WarehouseService } from './warehouse.service';

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
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
    InventoryModule,
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    WarehouseRepository,
    JwtOrgStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtOrgAuthGuard,
    },
  ],
  exports: [],
})
export class WarehouseModule {}
