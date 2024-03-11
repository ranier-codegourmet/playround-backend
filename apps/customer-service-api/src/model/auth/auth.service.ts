import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganizationService } from '@repo/nest-organization-module';
import { User } from '@repo/nest-user-module';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService,
  ) {}

  async generateOrganizationToken(user: User): Promise<string> {
    const organization =
      await this.organizationService.getOrganizationCredentialsByUser(user);

    if (!organization.organization.type) {
      throw new BadRequestException('Organization not found');
    }

    return this.organizationService.generateOrganizationToken(
      organization,
      user,
    );
  }

  async generateToken(user: Partial<User>): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
