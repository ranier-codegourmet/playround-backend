import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@repo/nest-user-module';
import { ClientSession } from 'mongoose';

import { OrganizationMemberStatusEnum } from './organization-member.interface';
import { OrganizationMemberRepository } from './organization-member.repository';
import { OrganizationMember } from './organization-member.schema';

@Injectable()
export class OrganizationMemberService {
  constructor(
    private readonly organizationMemberRepository: OrganizationMemberRepository,
  ) {}

  async create(
    organizationMember: Partial<OrganizationMember>,
    session?: ClientSession,
  ) {
    const member = await this.organizationMemberRepository.findOne({
      organization: organizationMember.organization,
      user: organizationMember.user,
    });

    if (member) {
      switch (member.status) {
        case OrganizationMemberStatusEnum.ACCEPTED:
          throw new BadRequestException(
            'User is already a member of this organization',
          );
        case OrganizationMemberStatusEnum.REJECTED:
        case OrganizationMemberStatusEnum.REMOVE:
          break;
        case OrganizationMemberStatusEnum.PENDING:
        default:
          throw new BadRequestException(
            'User has a pending request to join this organization',
          );
      }
    }

    return this.organizationMemberRepository.findOneAndUpdate(
      {
        organization: organizationMember.organization,
        user: organizationMember.user,
      },
      organizationMember,
      { session, projection: { __v: 0 } },
    );
  }

  async findMemberByUser(user: User): Promise<OrganizationMember | null> {
    return this.organizationMemberRepository.findOne({ user });
  }
}
