import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategorySchema } from './schemas/category.schema'; // Adjust the import path based on your directory structure
import { CategoryService } from './category.service';
import { ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
  exports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema }, // Ensure the Category schema is also exported if needed
    ]),
  ],
})
export class ProductModule {}
