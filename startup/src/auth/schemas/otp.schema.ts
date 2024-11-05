import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Otp extends Document {
  @Prop()
  phoneNumber: string;

  @Prop()
  value: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
