import { IsNumber, IsString, } from "class-validator";

export class UpdateProductDTO {
    @IsString()
    name: string;

    @IsNumber()
    price: number

    @IsString()
    description: string

    @IsNumber()
    rating: number

    @IsNumber()
    stock: number

    @IsString()
    image: string
}