import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/auth/public.decorator';
import { Product } from './schemas/product.schema';
import { UpdateProductDTO } from './dto/update.product.dto';
import { ProductDto } from './dto/product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateReviewDto } from './dto/review.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Public()
  @Post('/addproduct')
  createProduct(@Body() productDto: ProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Public()
  @Post(':id/reviews')
  async addReview(
    @Param('id') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.productService.addReviewToProduct(productId, createReviewDto);
  }

  @Public()
  @Get('/allproduct')
  async getAllProduct(): Promise<Product[]> {
    return this.productService.getAllProduct();
  }

  @Public()
  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    return product;
  }

  @Public()
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Public()
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deletProduct(id);
  }
}
