import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class CartSchema {
  @Prop()
  name: string;
}
