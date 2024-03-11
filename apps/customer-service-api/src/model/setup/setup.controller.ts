import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtCSOrgAuthGuard } from '@repo/nest-auth-module';
import { BasicApiResponse } from '@repo/nest-basic-types';

import { SetupOrganizationDTO } from './setup.dto';
import { SetupOrganizationResponse } from './setup.interface';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  private logger: Logger = new Logger(SetupController.name);

  constructor(private readonly setupService: SetupService) {}

  @UseGuards(JwtCSOrgAuthGuard)
  @Post('organization')
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        data: {
          organization: {
            organization: {
              _id: '1',
              name: 'My Organization',
              type: 'STANDARD',
              createdAt: '2021-08-30T16:27:31.000Z',
              updatedAt: '2021-08-30T16:27:31.000Z',
            },
            organizationMembers: {
              id: '1',
              organization: '1',
              user: '1',
              status: 'ACCEPTED',
              createdAt: '2021-08-30T16:27:31.000Z',
              updatedAt: '2021-08-30T16:27:31.000Z',
            },
            organizationRole: {
              _id: '1',
              organizationMember: '1',
              role: 'OWNER',
              createdAt: '2021-08-30T16:27:31.000Z',
              updatedAt: '2021-08-30T16:27:31.000Z',
            },
          },
          user: {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
          },
        },
      },
    },
  })
  async setupOrganization(
    @Body() payload: SetupOrganizationDTO,
  ): Promise<BasicApiResponse<SetupOrganizationResponse>> {
    this.logger.log(`Creating organization for user: ${payload.user.email}`);

    const response = await this.setupService.setupOrganization(payload);

    return {
      data: response,
    };
  }
}
