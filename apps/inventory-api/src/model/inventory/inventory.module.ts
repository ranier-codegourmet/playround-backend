import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtOrgStrategy } from '@repo/nest-auth-module';
import * as Joi from 'joi';

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
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository, JwtOrgStrategy],
  exports: [InventoryService],
})
export class InventoryModule {}
