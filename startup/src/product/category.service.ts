// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/category.dto'; // Import DTO

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // Create a new category
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, parentCategory } = createCategoryDto;

    try {
      const category = await this.categoryModel.create({
        name,
        parentCategory,
        subcategories: [], // Initialize with an empty array
      });

      return category;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  // Get a category by ID
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException('Category Not Found');
    }

    return category;
  }

  // Update a category
  //   async updateCategory(
  //     id: string,
  //     updateData: Partial<CreateCategoryDto>,
  //   ): Promise<Category> {
  //     const category = await this.categoryModel.findById(id).exec();

  //     if (!category) {
  //       throw new NotFoundException(`Category with ID ${id} Not Found`);
  //     }

  //     try {
  //       const updatedCategory = await this.categoryModel
  //         .findByIdAndUpdate(id, updateData, { new: true })
  //         .exec();
  //       return updatedCategory;
  //     } catch (error) {
  //       throw new Error('Internal Server Error');
  //     }
  //   }

  // Delete a category
  async deleteCategory(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} Not Found`);
    }

    try {
      await this.categoryModel.findByIdAndDelete(id);
      return category; // Return the deleted category
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
}
