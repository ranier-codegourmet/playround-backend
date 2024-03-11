import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@repo/nest-user-module';
import * as mongoose from 'mongoose';

import { Organization } from '../organization/organization.schema';
import { OrganizationMemberStatusEnum } from './organization-member.interface';

@Schema({
  timestamps: true,
})
export class OrganizationMember {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: String,
    enum: [
      OrganizationMemberStatusEnum.PENDING,
      OrganizationMemberStatusEnum.ACCEPTED,
      OrganizationMemberStatusEnum.REJECTED,
      OrganizationMemberStatusEnum.REMOVE,
    ],
    default: OrganizationMemberStatusEnum.PENDING,
    required: true,
  })
  status: string;
}

export const OrganizationMemberSchema =
  SchemaFactory.createForClass(OrganizationMember);

OrganizationMemberSchema.index({ organization: 1, user: 1 }, { unique: true });

export type OrganizationMemberDocument =
  mongoose.HydratedDocument<OrganizationMember>;
