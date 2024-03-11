import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<User>,
    update: UpdateQuery<User>,
    options: QueryOptions<User> = {}
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        ...options,
      })
      .lean();
  }

  async findOne(
    filter: FilterQuery<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<User | null> {
    return this.userModel.findOne(filter, projection, options).lean();
  }

  async findById(
    id: string,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<User | null> {
    return this.userModel.findById(id, projection, options).lean();
  }
}
