import { Controller, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { Category } from './schemas/category.schema';
import { Public } from 'src/auth/public.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Endpoint to add a new category
  @Public()
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // Optional: You can add another endpoint to create subcategories if needed
  @Post('sub')
  async createSubcategory(
    @Body() createSubcategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createSubcategoryDto);
  }
}
