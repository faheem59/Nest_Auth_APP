import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/auth/public.decorator';
import { Product } from './schemas/product.schema';
import { UpdateProductDTO } from './dto/update.product.dto';
import { Request } from 'express';
import { ProductDto } from './dto/product.dto';
import { CurrentUser } from './current-user.decorator';
import { User } from './interfaces/interface';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ) { }

    @Post('/addproduct')
    createProduct(@Body() productDto: ProductDto, @CurrentUser() user: User) {
        const userId = user.id
        return this.productService.createProduct(productDto, userId);
    }

    @Public()
    @Get('/allproduct')
    async getAllProduct(): Promise<Product[]> {
        return this.productService.getAllProduct();
    }

    @Public()
    @Get('/:id')
    async getProductById(@Param('id') id: string) {
        const product = await this.productService.getProductById(id)
        return product;
    }

    @Public()
    @Patch('/:id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDTO
    ): Promise<Product> {
        return this.productService.updateProduct(id, updateProductDto);
    }

    @Public()
    @Delete('/:id')
    async deleteProduct(
        @Param('id') id: string,
    ): Promise<void> {
        await this.productService.deletProduct(id);
    }
}
