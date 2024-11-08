import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, ObjectId } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop()
  phoneNumber: string;

  @Prop({
    type: [
      {
        productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  })
  cart: { productId: ObjectId; quantity: number }[];
  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpire: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
