import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update.product.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './schemas/review.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private categoryService: CategoryService,
  ) {}

  async createProduct(productDto: ProductDto): Promise<Product> {
    const {
      name,
      description,
      stock,
      currentPrice,
      originalPrice,
      images,
      category,
      subCategory,
    } = productDto;

    const categoryDoc = await this.categoryService.createCategory({
      name: category,
    });
    let subCategoryDoc;
    if (subCategory) {
      subCategoryDoc = await this.categoryService.createCategory({
        name: subCategory,
        parentCategory: categoryDoc._id,
      } as CreateCategoryDto);
    }
    try {
      const product = await this.productModel.create({
        name,
        description,
        stock,
        currentPrice,
        originalPrice,
        images,
        category: categoryDoc._id,
        subCategory: subCategoryDoc ? subCategoryDoc._id : null,
      });

      return product;
    } catch (e) {
      throw new Error('Internal Server Error');
    }
  }

  async getAllProduct(): Promise<Product[]> {
    try {
      const product = await this.productModel
        .find()
        .populate('category')
        .populate('subCategory')
        .populate({
          path: 'reviews',
          model: 'Review',
        })
        .exec();

      return product;
    } catch (e) {
      throw new Error('Internal Server Error');
    }
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('subCategory')
      .populate({
        path: 'reviews',
        model: 'Review',
      })
      .exec();

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    try {
      if (!product) {
        throw new NotFoundException(`Product for this ${id} is Not Found`);
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(
          `Product with ID ${id} could not be updated`,
        );
      }

      return updatedProduct;
    } catch (e) {
      throw new Error('Internal Server Error');
    }
  }

  async deletProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    try {
      if (!product) {
        throw new NotFoundException(`Product for this ${id} is Not Found`);
      }
      await this.productModel.findByIdAndDelete(id);
      return product;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async addReviewToProduct(
    productId: string,
    createReviewDto: CreateReviewDto,
  ) {
    // Step 1: Create a new review
    const review = new this.reviewModel(createReviewDto);
    await review.save();

    // Step 2: Add the review's ID to the product's reviews array
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    product.reviews = product.reviews || [];
    product.reviews.push(review._id as Types.ObjectId);
    await product.save();
    await product.save();

    return review;
  }
}
