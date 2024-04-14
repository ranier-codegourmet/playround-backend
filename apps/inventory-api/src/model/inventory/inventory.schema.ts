import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
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
export class Inventory {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  sku: string;

  @Prop()
  description: string;

  @Prop()
  barcode: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;

  @Prop()
  color: string;

  @Prop()
  weight: string;

  @Prop()
  dimension: string;

  @Prop({
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
    get: (v: mongoose.Schema.Types.Decimal128): string =>
      (+v.toString()).toFixed(4),
  })
  price: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true,
    required: true,
  })
  organization: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

export type InventoryDocument = mongoose.HydratedDocument<Inventory>;
