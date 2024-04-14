import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtOrgStrategy } from '@repo/nest-auth-module';
import { TransactionService } from '@repo/nest-mongo-database';
import * as Joi from 'joi';

import { WarehouseModule } from '../warehouse/warehouse.module';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { Inventory, InventorySchema } from './inventory.schema';
import { InventoryService } from './inventory.service';

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
      { name: Inventory.name, schema: InventorySchema },
    ]),
    WarehouseModule,
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    InventoryRepository,
    JwtOrgStrategy,
    TransactionService,
  ],
  exports: [],
})
export class InventoryModule {}
