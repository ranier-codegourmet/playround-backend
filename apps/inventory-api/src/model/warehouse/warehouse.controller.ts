import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  JwtOrgAuthGuard,
  UserOrganizationCredentials,
  UseUserOrgCredentials,
} from '@repo/nest-auth-module';
import { ValidateObjectIdPipe } from '@repo/nest-validation-pipes';

import {
  CreateWarehouseDTO,
  UpdateWarehouseDTO,
  WarehouseGridDTO,
} from './warehouse.dto';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  private logger: Logger = new Logger(WarehouseController.name);

  constructor(private readonly warehouseService: WarehouseService) {}

  @UseGuards(JwtOrgAuthGuard)
  @Post()
  async createWarehouse(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Body() warehouse: CreateWarehouseDTO,
  ) {
    this.logger.log(
      `Creating warehouse: ${warehouse.name} by ${userOrgCrentials.user.email} for ${userOrgCrentials.organization.id}`,
    );

    return this.warehouseService.create({
      ...warehouse,
      organization: userOrgCrentials.organization.id,
    });
  }

  @UseGuards(JwtOrgAuthGuard)
  @Get()
  async grid(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Query() query: WarehouseGridDTO,
  ) {
    this.logger.log(
      `Fetching warehouses for ${
        userOrgCrentials.organization.id
      } with query ${JSON.stringify(query)}`,
    );

    return this.warehouseService.grid(query, userOrgCrentials.organization.id);
  }

  @UseGuards(JwtOrgAuthGuard)
  @Put('/:id')
  async updateWarehouse(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Body() warehouse: UpdateWarehouseDTO,
    @Param('id', new ValidateObjectIdPipe()) id: string,
  ) {
    this.logger.log(
      `Updating warehouse: ${id} by ${userOrgCrentials.user.email} for ${userOrgCrentials.organization.id}`,
    );

    const updatedWarehouse = await this.warehouseService.updateById(
      id,
      warehouse,
    );

    return {
      data: updatedWarehouse,
    };
  }
}
