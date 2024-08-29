import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongoose"

class ImageDto {
    @IsString()
    public_id: string;

    @IsString()
    url: string;
}

class ReviewDto {
    @IsString()
    name: string;

    @IsNumber()
    rating: number;

    @IsString()
    comment: string;
}

export class ProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;

    @IsNumber()
    rating: number;

    @IsNumber()
    stock: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: ImageDto[];

    @IsString()
    category: string;

    @IsNumber()
    numOfReviews: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewDto)
    reviews: ReviewDto[];

    @IsOptional()
    @IsMongoId()
    user: ObjectId;

    @IsOptional()
    @IsString()
    createAt?: string;
}
