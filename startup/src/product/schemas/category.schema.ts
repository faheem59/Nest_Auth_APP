// category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  parentCategory?: string; // optional, to reference parent category

  @Prop({
    type: [{ type: String }],
    required: false,
  })
  subcategories: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
