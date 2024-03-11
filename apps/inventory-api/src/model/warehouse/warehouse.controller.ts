import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  JwtOrgAuthGuard,
  UserOrganizationCredentials,
  UseUserOrgCredentials,
} from '@repo/nest-auth-module';

import { CreateWarehouseDTO } from './warehouse.dto';
import { WarehouseService } from './warehouse.service';

@ApiTags('warehouse')
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
}
