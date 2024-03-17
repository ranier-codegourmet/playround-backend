import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Organization, OrganizationDocument } from './organization.schema';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<Organization>,
    update: UpdateQuery<Organization>,
    options: QueryOptions = {},
  ): Promise<Organization> {
    return this.organizationModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      ...options,
    });
  }

  async findOne(
    filter: FilterQuery<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>,
  ): Promise<Organization | null> {
    return this.organizationModel.findOne(filter, projection, options);
  }
}
