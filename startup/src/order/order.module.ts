import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AuthModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
