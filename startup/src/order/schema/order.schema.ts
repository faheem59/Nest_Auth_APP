import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class ShippingInfo {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  pinCode: number;

  @Prop({ required: true })
  phoneNo: number;
}

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: MongooseSchema.Types.Mixed, ref: 'Product', required: true })
  product: ObjectId;
}

@Schema({ timestamps: true })
export class PaymentInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  status: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: ShippingInfo })
  shippingInfo: ShippingInfo;

  @Prop({ type: [OrderItem], required: true })
  orderItems: OrderItem[];

  @Prop({ type: MongooseSchema.Types.Mixed, ref: 'User', required: true })
  user: ObjectId;

  @Prop({ type: PaymentInfo })
  paymentInfo: PaymentInfo;

  @Prop()
  paidAt: Date;

  @Prop({ required: true, default: 0 })
  itemsPrice: number;

  @Prop({ required: true, default: 0 })
  taxPrice: number;

  @Prop({ required: true, default: 0 })
  shippingPrice: number;

  @Prop({ required: true, default: 0 })
  totalPrice: number;

  @Prop({ required: true, default: 'Processing' })
  orderStatus: string;

  @Prop()
  deliveredAt?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
