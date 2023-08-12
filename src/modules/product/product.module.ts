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
import { PhotoService } from '../photo/photo.service';
import { PhotoRepository } from '../photo/photo.repository';
import { ImageService } from 'src/common/image/image.service';

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
    PhotoService,
    PhotoRepository,
    ImageService,
  ],
  exports: [],
})
export class ProductModule {}
