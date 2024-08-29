import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model, ObjectId } from "mongoose"
import { CreateOrderDTO } from './dto/order.dto';
import { Product } from 'src/product/schemas/product.schema';


@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name)
        private orderModel: Model<Order>,
        @InjectModel(Product.name)
        private productModel: Model<Product>
    ) { }

    async createOrder(createOrderDto: CreateOrderDTO, userId: string): Promise<Order> {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = createOrderDto;

        const order = await this.orderModel.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user: userId,
        })
        await order.save();

        return order;

    }
    async getAllOrder(): Promise<Order[]> {
        return await this.orderModel.find().exec();
    }

    async getSingleOrder(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).populate(
            "user",
            "name email"
        ).exec()

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async myOrder(userId: string): Promise<Order[]> {
        const myorder = await this.orderModel.find({ user: userId })
        if (!myorder) {
            throw new NotFoundException(`Myorder is not found`)
        }
        return myorder;
    }

    async updateOrder(id: string): Promise<void> {
        const order = await this.orderModel.findById(id);


        if (!order) {
            throw new NotFoundException(`Order Not found ${id}`);

        }

        if (order.orderStatus === 'Delievered') {
            throw new NotFoundException("You have already purchase this Order");
        }

        if (order.orderStatus === 'Shipped') {
            await Promise.all(
                order.orderItems.map(async (o) => {
                    await this.updateStock(o.product, o.quantity);
                })
            );
        }
    }

    async updateStock(id: ObjectId, quantity: number) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new NotFoundException("Product Not Found");
        }

        product.stock -= quantity;
        await product.save({ validateBeforeSave: false });
    }

    async deleteOrder(id: string) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new NotFoundException(`Order for this id ${id} is not found `)
        }

        await this.orderModel.findByIdAndDelete(id);

    }
    


}
