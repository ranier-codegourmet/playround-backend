import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoSortOrderEnum, SortOrderEnum } from '@repo/nest-basic-types';
import { ClientSession } from 'mongoose';

import { WarehouseGridDTO } from './warehouse.dto';
import { ItemEnum } from './warehouse.interface';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse } from './warehouse.schema';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async create(payload: Partial<Warehouse>) {
    const warehouse = await this.warehouseRepository.findOne({
      name: payload.name,
      organization: payload.organization,
    });

    if (warehouse) {
      throw new BadRequestException('Warehouse with this name already exists');
    }

    return this.warehouseRepository.findOneAndUpdate(
      {
        name: payload.name,
      },
      payload,
      {
        upsert: true,
      },
    );
  }

  async updateById(
    id: string,
    warehouse: Partial<Warehouse>,
  ): Promise<Warehouse> {
    const existingWarehouse = await this.warehouseRepository.findById(id);

    if (!existingWarehouse) {
      throw new BadRequestException('Warehouse not found');
    }

    const duplicateWarehouse = await this.warehouseRepository.findOne({
      name: warehouse.name,
      organization: existingWarehouse.organization,
      _id: { $ne: id },
    });

    if (duplicateWarehouse) {
      throw new BadRequestException('Warehouse with this name already exists');
    }

    return this.warehouseRepository.findOneAndUpdate({ _id: id }, warehouse);
  }

  async grid(
    query: WarehouseGridDTO,
    organization: string,
  ): Promise<{
    data: Warehouse[];
    totalCount: number;
  }> {
    let gridSorts = {};

    if (query.sorts && query.sorts.length > 0) {
      gridSorts = query.sorts.reduce((acc, sort) => {
        acc[sort.field] =
          sort.order === SortOrderEnum.ASC
            ? MongoSortOrderEnum.ASC
            : MongoSortOrderEnum.DESC;
        return acc;
      }, {});
    } else {
      gridSorts = { createdAt: MongoSortOrderEnum.ASC };
    }

    const grid = await this.warehouseRepository.grid(
      organization,
      gridSorts,
      query.pagination?.page,
      query.pagination?.limit,
      query.searchTerms,
    );

    return grid;
  }

  async deleteById(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(id);

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }

    await this.warehouseRepository.deleteById(id);
  }

  async addItem(
    warehouseId: string,
    item: {
      id: string;
      type: ItemEnum;
    },
    session?: ClientSession,
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findById(warehouseId);

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }

    const existingItem = warehouse.items.find(
      (i) => i.id === item.id && i.type === item.type,
    );

    if (existingItem) {
      return warehouse;
    }

    return this.warehouseRepository.findOneAndUpdate(
      { _id: warehouseId },
      { $push: { items: item } },
      { session },
    );
  }

  async removeItemFromAllWarehouse(
    itemId: string,
    session?: ClientSession,
  ): Promise<void> {
    await this.warehouseRepository.updateMany(
      {},
      {
        $pull: { items: { id: itemId } },
      },
      session,
    );

    return;
  }
}
