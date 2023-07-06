import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { CategoryEntity } from './category/category.entity';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryRepository } from './category/cateogory.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
    AuthModule,
  ],
  controllers: [ProductController, CategoryController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryService,
    CategoryRepository,
  ],
  exports: [],
})
export class ProductModule {}
