import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose'
import { ProductDto } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update.product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>
    ) { }

    async createProduct(productDto: ProductDto, userId: string): Promise<Product> {
        const { name, price, description, stock, rating, images, category, numOfReviews, reviews } = productDto;

        const product = await this.productModel.create({
            name,
            price,
            description,
            stock,
            rating,
            images,
            category,
            numOfReviews,
            reviews,
            user: userId
        })

        await product.save();

        return product;
    }

    async getAllProduct(): Promise<Product[]> {
        const products = await this.productModel.find().exec();

        return products
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec()
        if (!product) {
            throw new NotFoundException('Product Not Found');
        }
        return product;
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDTO): Promise<Product> {
        const product = await this.productModel.findById(id).exec()
        if (!product) {
            throw new NotFoundException(`Product for this ${id} is Not Found`);
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            updateProductDto,
            { new: true }
        ).exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} could not be updated`);
        }

        return updatedProduct;
    }

    async deletProduct(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec()
        if (!product) {
            throw new NotFoundException(`Product for this ${id} is Not Found`);

        }
        await this.productModel.findByIdAndDelete(id);
        return product;

    }
}
