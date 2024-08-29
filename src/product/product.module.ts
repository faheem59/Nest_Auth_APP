import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])]
})
export class ProductModule { }
