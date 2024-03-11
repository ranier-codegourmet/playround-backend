import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtOrgAuthGuard,
  UserOrganizationCredentials,
  UseUserOrgCredentials,
} from '@repo/nest-auth-module';
import { UserService } from '@repo/nest-user-module';

import { UpdateUserDTO } from './user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  private logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtOrgAuthGuard)
  @Get('current')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@test.com',
          gender: 'Male',
          createdAt: '2021-08-30T16:27:31.000Z',
          updatedAt: '2021-08-30T16:27:31.000Z',
        },
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@test.com',
          gender: 'Male',
          createdAt: '2021-08-30T16:27:31.000Z',
          updatedAt: '2021-08-30T16:27:31.000Z',
        },
      },
    },
  })
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
