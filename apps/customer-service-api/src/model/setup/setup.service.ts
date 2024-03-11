import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationService } from '@repo/nest-organization-module';
import { UserService } from '@repo/nest-user-module';
import * as bcrypt from 'bcrypt';

import { SetupOrganizationDTO } from './setup.dto';
import { SetupOrganizationResponse } from './setup.interface';

@Injectable()
export class SetupService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async setupOrganization(
    payload: SetupOrganizationDTO,
  ): Promise<SetupOrganizationResponse> {
    const user = await this.userService.findOneByEmail(payload.user.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(
      payload.user.password,
      salt,
    );

    const savedUser = await this.userService.create({
      ...payload.user,
      salt,
      password: hashedPassword,
    });

    const organization = await this.organizationService.create(
      payload.organization,
      savedUser,
    );

    return {
      organization,
      user: savedUser,
    };
  }
}
