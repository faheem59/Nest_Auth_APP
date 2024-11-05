import { IsArray, IsDate, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongoose"

class ShippingInfoDTO {
    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    country: string;

    @IsNumber()
    pinCode: number;

    @IsNumber()
    phoneNo: number;
}

class OrderItemDTO {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsString()
    image: string;

    @IsMongoId()
    product: ObjectId;
}

class PaymentInfoDTO {
    @IsString()
    id: string;

    @IsString()
    status: string;
}

export class CreateOrderDTO {
    @ValidateNested()
    @Type(() => ShippingInfoDTO)
    shippingInfo: ShippingInfoDTO;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    orderItems: OrderItemDTO[];

    @IsOptional()
    @IsMongoId()
    user: ObjectId;

    @ValidateNested()
    @Type(() => PaymentInfoDTO)
    paymentInfo: PaymentInfoDTO;

    // @IsDate()
    // paidAt: Date;

    @IsNumber()
    itemsPrice: number;

    @IsNumber()
    taxPrice: number;

    @IsNumber()
    shippingPrice: number;

    @IsNumber()
    totalPrice: number;

    @IsString()
    orderStatus: string;

    @IsOptional()
    @IsDate()
    deliveredAt?: Date;
}
