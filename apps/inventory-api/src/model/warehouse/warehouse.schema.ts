import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Warehouse {
  _id: string;

  @Prop({ required: true })
  name: string;

  address: string;

  city: string;

  code: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true,
    required: true,
  })
  organization: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

export type WarehouseDocument = mongoose.HydratedDocument<Warehouse>;
