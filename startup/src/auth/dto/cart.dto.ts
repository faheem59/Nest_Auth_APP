// add-to-cart.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

// remove-from-cart.dto.ts
export class RemoveFromCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class UpdateCartQuantityDto {
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
