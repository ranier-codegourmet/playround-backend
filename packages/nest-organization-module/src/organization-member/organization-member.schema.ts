import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

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
  organization: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

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
