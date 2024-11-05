// dto/create-category.dto.ts
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parentCategory?: string; // Correctly typed as string | undefined

  @IsOptional()
  @IsArray()
  subcategories?: string[]; // Optional array for subcategories
}
