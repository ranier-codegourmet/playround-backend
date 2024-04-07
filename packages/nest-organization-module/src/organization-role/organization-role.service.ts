import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';

import { OrganizationMember } from '../organization-member/organization-member.schema';
import { OrganizationRoleRepository } from './organization-role.repository';
import { OrganizationRole } from './organization-role.schema';

@Injectable()
export class OrganizationRoleService {
  constructor(
    private readonly organizationRoleRepository: OrganizationRoleRepository,
  ) {}

  async create(
    organizationRole: Partial<OrganizationRole>,
    session?: ClientSession,
  ) {
    return this.organizationRoleRepository.findOneAndUpdate(
      {
        organizationMember: organizationRole.organizationMember,
      },
      organizationRole,
      { session, projection: { __v: 0 } },
    );
  }

  async findRoleByOrganizationMember(
    organizationMember: OrganizationMember,
  ): Promise<OrganizationRole | null> {
    return this.organizationRoleRepository.findOne({
      organizationMember: organizationMember._id,
    });
  }
}
