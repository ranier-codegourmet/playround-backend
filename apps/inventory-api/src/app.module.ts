import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseModule } from '@repo/nest-mongo-database';
import * as Joi from 'joi';

import { WarehouseModule } from './model/warehouse/warehouse.module';

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
    WarehouseModule,
  ],
})
export class AppModule {}
