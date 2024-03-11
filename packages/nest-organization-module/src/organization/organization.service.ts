import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TransactionService } from '@repo/nest-mongo-database';
import { User } from '@repo/nest-user-module';

import { OrganizationMemberStatusEnum } from '../organization-member/organization-member.interface';
import { OrganizationMemberService } from '../organization-member/organization-member.service';
import { RoleEnum } from '../organization-role/organization-role.interface';
import { OrganizationRoleService } from '../organization-role/organization-role.service';
import {
  CreateOrganization,
  OrganizationTypeEnum,
} from './organization.interface';
import { OrganizationRepository } from './organization.repository';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMemberService: OrganizationMemberService,
    private readonly organizationRoleService: OrganizationRoleService,
    private readonly transactionService: TransactionService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    organization: Partial<Organization>,
    user: User,
  ): Promise<CreateOrganization> {
    return this.transactionService.withTransaction<CreateOrganization>(
      async (session) => {
        const newOrganization =
          await this.organizationRepository.findOneAndUpdate(
            {
              name: organization.name,
              type: OrganizationTypeEnum.STANDARD,
            },
            organization,
            { session, projection: { __v: 0 } },
          );

        const organizationMember = await this.organizationMemberService.create(
          {
            organization: newOrganization,
            user,
            status: OrganizationMemberStatusEnum.ACCEPTED,
          },
          session,
        );

        const organizationRole = await this.organizationRoleService.create(
          {
            organizationMember: organizationMember,
            role: RoleEnum.OWNER,
          },
          session,
        );

        return {
          organization: newOrganization,
          organizationMember,
          organizationRole,
        };
      },
    );
  }

  async getOrganizationById(organizationId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne(
      {
        _id: organizationId,
      },
      { __v: 0 },
    );

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    return organization;
  }

  async getOrganizationCredentialsByUser(
    user: User,
  ): Promise<CreateOrganization> {
    const organizationMember =
      await this.organizationMemberService.findMemberByUser(user);

    if (!organizationMember) {
      throw new BadRequestException(
        'Organization not found or User is not a member',
      );
    }

    const organization = await this.organizationRepository.findOne({
      _id: organizationMember.organization,
    });

    const organizationRole =
      await this.organizationRoleService.findRoleByOrganizationMember(
        organizationMember,
      );

    return {
      organization,
      organizationMember,
      organizationRole,
    };
  }

  async generateOrganizationToken(
    organization: CreateOrganization,
    user: User,
  ): Promise<string> {
    const payload = {
      organization: {
        id: organization.organization._id,
        name: organization.organization.name,
        type: organization.organization.type,
        memberId: organization.organizationMember._id,
        role: organization.organizationRole.role,
        roleId: organization.organizationRole._id,
      },
      user: {
        id: user._id,
        email: user.email,
      },
    };

    return this.jwtService.sign(payload);
  }
}
