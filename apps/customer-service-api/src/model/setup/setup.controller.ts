import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtCSOrgAuthGuard } from '@repo/nest-auth-module';
import { BasicApiResponse } from '@repo/nest-basic-types';

import { SetupOrganizationDTO } from './setup.dto';
import { SetupOrganizationResponse } from './setup.interface';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  private logger: Logger = new Logger(SetupController.name);

  constructor(private readonly setupService: SetupService) {}

  @UseGuards(JwtCSOrgAuthGuard)
  @Post('organization')
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
