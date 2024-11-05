// product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, maxLength: 8 })
  stock: number;

  @Prop({ required: true })
  currentPrice: number; // Current price field

  @Prop({ required: true })
  originalPrice: number; // Original price field

  @Prop({
    type: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  })
  images: { public_id: string; url: string }[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  subCategory?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }], default: [] })
  reviews?: Types.ObjectId[];

  @Prop()
  rating?: number;

  @Prop()
  numOfReviews: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
