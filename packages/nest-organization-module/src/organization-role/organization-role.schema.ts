import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { OrganizationMember } from '../organization-member/organization-member.schema';
import { RoleEnum } from './organization-role.interface';

@Schema({
  timestamps: true,
})
export class OrganizationRole {
  _id: string;

  @Prop({
    type: String,
    required: true,
    enum: [RoleEnum.ADMIN, RoleEnum.MEMBER, RoleEnum.OWNER],
  })
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationMember',
    required: true,
  })
  organizationMember: OrganizationMember;
}

export const OrganizationRoleSchema =
  SchemaFactory.createForClass(OrganizationRole);

export type OrganizationRoleDocument =
  mongoose.HydratedDocument<OrganizationRole>;
