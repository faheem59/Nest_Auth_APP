// dto/product.dto.ts
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  currentPrice: number; // Current price of the product

  @IsNumber()
  originalPrice: number; // Original price of the product

  @IsOptional()
  @IsArray()
  images: { public_id: string; url: string }[]; // Array of images

  @IsString()
  category: string; // Category name or ID

  @IsOptional()
  @IsString()
  subCategory?: string;
}
