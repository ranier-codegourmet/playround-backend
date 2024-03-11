import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import {
  OrganizationRole,
  OrganizationRoleDocument,
} from './organization-role.schema';

@Injectable()
export class OrganizationRoleRepository {
  constructor(
    @InjectModel(OrganizationRole.name)
    private readonly organizationRoleModel: Model<OrganizationRoleDocument>,
  ) {}

  async create(
    organizationRole: Partial<OrganizationRole>,
  ): Promise<OrganizationRole> {
    return this.organizationRoleModel.create(organizationRole);
  }

  async findOneAndUpdate(
    filter: FilterQuery<OrganizationRole>,
    update: UpdateQuery<OrganizationRole>,
    options: QueryOptions = {},
  ): Promise<OrganizationRole> {
    return this.organizationRoleModel
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        ...options,
      })
      .lean();
  }

  async findOne(
    filter: Partial<OrganizationRole>,
  ): Promise<OrganizationRole | null> {
    return this.organizationRoleModel.findOne(filter).lean();
  }
}
