import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoSortOrderEnum, SortOrderEnum } from '@repo/nest-basic-types';

import { InventoryGridDTO } from './inventory.dto';
import { InventoryRepository } from './inventory.repository';
import { Inventory } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async create(payload: Partial<Inventory>) {
    const inventory = await this.inventoryRepository.findOne({
      name: payload.name,
      organization: payload.organization,
    });

    if (inventory) {
      throw new BadRequestException('Inventory with this name already exists');
    }

    return this.inventoryRepository.findOneAndUpdate(
      {
        name: payload.name,
      },
      payload,
      { projection: { __v: 0 } },
    );
  }

  async updateById(
    id: string,
    inventory: Partial<Inventory>,
  ): Promise<Inventory> {
    const existingInventory = await this.inventoryRepository.findById(id);

    if (!existingInventory) {
      throw new BadRequestException('Inventory not found');
    }

    const duplicateInventory = await this.inventoryRepository.findOne({
      name: inventory.name,
      organization: existingInventory.organization,
      _id: { $ne: id },
    });

    if (duplicateInventory) {
      throw new BadRequestException('Inventory with this name already exists');
    }

    return this.inventoryRepository.findOneAndUpdate({ _id: id }, inventory, {
      projection: { __v: 0 },
    });
  }

  async grid(
    query: InventoryGridDTO,
    organization: string,
  ): Promise<{
    data: Inventory[];
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

    const grid = await this.inventoryRepository.grid(
      organization,
      gridSorts,
      query.pagination?.page,
      query.pagination?.limit,
      query.searchTerms,
    );

    return grid;
  }

  async removeWarehouseFromAllInventory(
    organizationId: string,
    warehouseId: string,
  ): Promise<void> {
    await this.inventoryRepository.updateMany(
      { organization: organizationId },
      { $pull: { warehouses: warehouseId } },
    );
  }
}
