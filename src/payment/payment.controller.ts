import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDTO } from 'src/order/dto/order.dto';
import { CurrentUser } from 'src/product/current-user.decorator';
import { User } from 'src/product/interfaces/interface';


@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @Post('/process')
    processpayment(@Body() createOrderDto: CreateOrderDTO, @CurrentUser() user: User) {
        const userId = user.id
        return this.paymentService.processpayment(createOrderDto, userId);
    }
}
