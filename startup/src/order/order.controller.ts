import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/order.dto';
import { Order } from './schema/order.schema';
import { CurrentUser } from './current-user.decorator';
import { User } from './interfaces/interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/order')
  async createOrder(
    @Body() createOrderDto: CreateOrderDTO,
    @CurrentUser() user: User,
  ): Promise<Order> {
    const userId = user.id;
    console.log('ff', user.id);
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('/allorder')
  async getAllOrder(): Promise<Order[]> {
    return await this.orderService.getAllOrder();
  }

  @Get('/:id')
  async getSingleOrder(@Param('id') id: string): Promise<Order> {
    const order = await this.orderService.getSingleOrder(id);
    return order;
  }
  @Get('/:userId')
  async myOrder(
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<Order[]> {
    userId = user.id;
    console.log('sfsfs', user.id);
    const myorder = await this.orderService.myOrder(userId);
    return myorder;
  }

  @Put('/:id')
  async updateOrder(@Param('id') id: string): Promise<void> {
    try {
      await this.orderService.updateOrder(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id')
  async deleteOrder(@Param('id') id: string) {
    try {
      await this.orderService.deleteOrder(id);
    } catch (error) {
      throw error;
    }
  }
}
