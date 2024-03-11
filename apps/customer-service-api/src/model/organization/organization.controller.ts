import {
  Body,
  Controller,
  Get,
  Logger,
  NotImplementedException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  JwtOrgAuthGuard,
  UserCredentials,
  UserOrganizationCredentials,
  UseUserCredentials,
  UseUserOrgCredentials,
} from '@repo/nest-auth-module';
import { BasicApiResponse } from '@repo/nest-basic-types';
import {
  CreateOrganizationDto,
  Organization,
  OrganizationService,
} from '@repo/nest-organization-module';
import { UserService } from '@repo/nest-user-module';

@Controller('organization')
export class OrganizationController {
  private logger: Logger = new Logger(OrganizationController.name);

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  // TODO: disable registration until we can launch the system to the public
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrganization(
    @Body() organization: CreateOrganizationDto,
    @UseUserCredentials() userCredentials: UserCredentials,
  ): Promise<{ access_token: string }> {
    throw new NotImplementedException('Registration is disabled');

    this.logger.log(`Creating organization for user: ${userCredentials.email}`);

    const user = await this.userService.findOneByEmail(userCredentials.email);

    const newOrganization = await this.organizationService.create(
      organization,
      user,
    );

    const token = await this.organizationService.generateOrganizationToken(
      newOrganization,
      user,
    );

    return {
      access_token: token,
    };
  }

  @UseGuards(JwtOrgAuthGuard)
  @Get('/')
  async getOrganization(
    @UseUserOrgCredentials() UserOrgs: UserOrganizationCredentials,
  ): Promise<BasicApiResponse<Organization>> {
    this.logger.log(
      `Getting organization details for: ${UserOrgs.organization.id}`,
    );

    const organization = await this.organizationService.getOrganizationById(
      UserOrgs.organization.id,
    );

    return {
      data: organization,
    };
  }
}
