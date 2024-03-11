import { BadRequestException, Injectable } from '@nestjs/common';

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
      { projection: { __v: 0 } },
    );
  }

  async grid(payload: any) {
    const {} = payload;
  }
}
