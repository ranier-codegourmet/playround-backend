import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoSortOrderEnum, SortOrderEnum } from '@repo/nest-basic-types';
import { TransactionService } from '@repo/nest-mongo-database';

import { ItemEnum } from '../warehouse/warehouse.interface';
import { WarehouseService } from '../warehouse/warehouse.service';
import { InventoryGridDTO } from './inventory.dto';
import { InventoryRepository } from './inventory.repository';
import { Inventory } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly warehouseService: WarehouseService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(payload: Partial<Inventory>, warehouses?: string[]) {
    const inventory = await this.inventoryRepository.findOne({
      name: payload.name,
      organization: payload.organization,
    });

    if (inventory) {
      throw new BadRequestException('Inventory with this name already exists');
    }

    return this.transactionService.withTransaction<Inventory>(
      async (session) => {
        const inventory = await this.inventoryRepository.findOneAndUpdate(
          {
            name: payload.name,
          },
          payload,
          { session, projection: { __v: 0 } },
        );

        if (warehouses && warehouses.length > 0) {
          await Promise.all(
            warehouses.map(async (warehouse) =>
              this.warehouseService.addItem(
                warehouse,
                {
                  id: inventory._id,
                  type: ItemEnum.INVENTORY,
                },
                session,
              ),
            ),
          );
        }

        return inventory;
      },
    );
  }

  async updateById(
    id: string,
    inventory: Partial<Inventory>,
    warehouses?: string[],
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

    return this.transactionService.withTransaction<Inventory>(
      async (session) => {
        const newInventory = await this.inventoryRepository.findOneAndUpdate(
          { _id: id },
          inventory,
          {
            projection: { __v: 0 },
            session,
          },
        );

        await this.warehouseService.removeItemFromAllWarehouse(
          newInventory._id,
          session,
        );

        if (warehouses && warehouses.length > 0) {
          await Promise.all(
            warehouses.map(async (warehouse) =>
              this.warehouseService.addItem(
                warehouse,
                {
                  id: newInventory._id,
                  type: ItemEnum.INVENTORY,
                },
                session,
              ),
            ),
          );
        }

        return newInventory;
      },
    );
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
}
