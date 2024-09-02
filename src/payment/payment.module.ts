import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/product/schemas/product.schema';
import { OrderSchema } from 'src/order/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
