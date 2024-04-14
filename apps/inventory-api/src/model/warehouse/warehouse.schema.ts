import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { ItemEnum } from './warehouse.interface';

class Item {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  id: string;
  @Prop({
    type: String,
    enum: ItemEnum,
    default: ItemEnum.INVENTORY,
    required: true,
  })
  type: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    },
  },
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

  @Prop({
    type: [Item],
    default: [],
  })
  items: Item[];
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

export type WarehouseDocument = mongoose.HydratedDocument<Warehouse>;
