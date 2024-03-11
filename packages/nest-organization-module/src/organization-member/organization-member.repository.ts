import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import {
  OrganizationMember,
  OrganizationMemberDocument,
} from './organization-member.schema';

@Injectable()
export class OrganizationMemberRepository {
  constructor(
    @InjectModel(OrganizationMember.name)
    private readonly organizationMemberModel: Model<OrganizationMemberDocument>,
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<OrganizationMember>,
    update: UpdateQuery<OrganizationMember>,
    options: QueryOptions = {},
  ): Promise<OrganizationMember> {
    return this.organizationMemberModel
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        ...options,
      })
      .lean();
  }

  async findOne(
    filter: FilterQuery<OrganizationMember>,
  ): Promise<OrganizationMember | null> {
    return this.organizationMemberModel.findOne(filter).lean();
  }
}
