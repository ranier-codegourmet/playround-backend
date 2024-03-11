import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { OrganizationTypeEnum } from './organization.interface';

@Schema({
  timestamps: true,
})
export class Organization {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: [OrganizationTypeEnum.STANDARD, OrganizationTypeEnum.SERVICE],
  })
  type: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

export type OrganizationDocument = HydratedDocument<Organization>;
