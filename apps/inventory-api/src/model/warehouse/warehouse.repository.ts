import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Warehouse, WarehouseDocument } from './warehouse.schema';

@Injectable()
export class WarehouseRepository {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<Warehouse>,
    update: UpdateQuery<Warehouse>,
    options: QueryOptions<Warehouse>,
  ): Promise<Warehouse> {
    return this.warehouseModel
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        ...options,
      })
      .lean();
  }

  async findOne(
    filter: FilterQuery<Warehouse>,
    projection?: ProjectionType<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ): Promise<Warehouse | null> {
    return this.warehouseModel.findOne(filter, projection, options).lean();
  }

  async find(
    filter: FilterQuery<Warehouse>,
    projection?: ProjectionType<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ) {
    return this.warehouseModel.find(filter, projection, options).lean();
  }
}
