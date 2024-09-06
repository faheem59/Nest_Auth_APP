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

        try {
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
        } catch (error) {
            throw new Error("Internal Server Error")
        }

    }
    async getAllOrder(): Promise<Order[]> {
        try {
            return await this.orderModel.find().exec();
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }

    async getSingleOrder(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).populate(
            "user",
            "name email"
        ).exec()

        try {
            if (!order) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }
            return order;
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }

    async myOrder(userId: string): Promise<Order[]> {
        const myorder = await this.orderModel.find({ user: userId })
        try {
            if (!myorder) {
                throw new NotFoundException(`Myorder is not found`)
            }
            return myorder;
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }

    async updateOrder(id: string): Promise<void> {
        const order = await this.orderModel.findById(id);
        try {
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

        } catch (error) {
            throw new Error("Internal Server Error")

        }


    }

    async updateStock(id: ObjectId, quantity: number) {
        const product = await this.productModel.findById(id);
        try {
            if (!product) {
                throw new NotFoundException("Product Not Found");
            }

            product.stock -= quantity;
            await product.save({ validateBeforeSave: false });
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }

    async deleteOrder(id: string) {
        const order = await this.orderModel.findById(id);
        try {
            if (!order) {
                throw new NotFoundException(`Order for this id ${id} is not found `)
            }

            await this.orderModel.findByIdAndDelete(id);

        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }



}
