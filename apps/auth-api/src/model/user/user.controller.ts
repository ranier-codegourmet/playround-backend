import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  JwtOrgAuthGuard,
  UserOrganizationCredentials,
  UseUserOrgCredentials,
} from '@repo/nest-auth-module';
import { UserService } from '@repo/nest-user-module';

import { UpdateUserDTO } from './user.dto';

@Controller('user')
export class UserController {
  private logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtOrgAuthGuard)
  @Get('current')
  async getCurrentUser(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials
  ) {
    this.logger.log(`Getting current user: ${userOrgCrentials.user.email}`);

    const user = await this.userService.findOneByEmail(
      userOrgCrentials.user.email
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      data: user,
    };
  }

  @UseGuards(JwtOrgAuthGuard)
  @Put('current')
  async updateCurrentUser(
    @UseUserOrgCredentials() userOrgCrentials: UserOrganizationCredentials,
    @Body() payload: UpdateUserDTO
  ) {
    this.logger.log(`Updating current user: ${userOrgCrentials.user.email}`);

    const user = await this.userService.updateById(
      userOrgCrentials.user.id,
      payload
    );

    return {
      data: user,
    };
  }
}
