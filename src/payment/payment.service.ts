import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { Model } from "mongoose"
import { Order } from 'src/order/schema/order.schema';
import { CreateOrderDTO } from 'src/order/dto/order.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>,
        @InjectModel(Order.name)
        private orderModel: Model<Order>

    ) { }
    async processpayment(createOrderDTO: CreateOrderDTO, userId: string): Promise<Order> {
        const { shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice } = createOrderDTO;

        const userid = userId || null;
        try {
            const newOrder = await this.orderModel.create({
                shippingInfo,
                orderItems,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentInfo: {
                    status: 'Cash On Delivery',
                    id: 'COD-' + Date.now(),
                },
                user: userid,
                paidAt: new Date(),
            });
            return newOrder;
        } catch (error) {
            throw new Error("Internal Server Error")
        }
    }

}
