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
  CreateInventoryDTO,
  InventoryGridDTO,
  UpdateInventoryDTO,
} from './inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  private logger: Logger = new Logger(InventoryController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtOrgAuthGuard)
  @Post()
  async createInventory(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Body() inventory: CreateInventoryDTO,
  ) {
    this.logger.log(
      `Creating inventory: ${inventory.name} by ${userOrgCrentials.user.email} for ${userOrgCrentials.organization.id}`,
    );

    const newInventory = await this.inventoryService.create({
      ...inventory,
      price: inventory.price.replace(/,/g, ''),
      organization: userOrgCrentials.organization.id,
    });

    return {
      data: newInventory,
    };
  }

  @UseGuards(JwtOrgAuthGuard)
  @Get()
  async grid(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Query() query: InventoryGridDTO,
  ) {
    this.logger.log(
      `Fetching inventory for ${
        userOrgCrentials.organization.id
      } with query ${JSON.stringify(query)}`,
    );

    return this.inventoryService.grid(query, userOrgCrentials.organization.id);
  }

  @UseGuards(JwtOrgAuthGuard)
  @Put('/:id')
  async updateInventory(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Body() inventory: UpdateInventoryDTO,
    @Param('id', new ValidateObjectIdPipe()) id: string,
  ) {
    this.logger.log(
      `Updating inventory: ${inventory.name} by ${userOrgCrentials.user.email} for ${userOrgCrentials.organization.id}`,
    );

    const updatedInventory = await this.inventoryService.updateById(id, {
      ...inventory,
      ...(inventory.price && { price: inventory.price.replace(/,/g, '') }),
    });

    return {
      data: updatedInventory,
    };
  }
}
