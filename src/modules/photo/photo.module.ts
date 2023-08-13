import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from 'src/common/image/image.service';
import { CategoryRepository } from '../product/category/cateogory.repository';
import { ProductRepository } from '../product/product.repository';
import { PhotoController } from './photo.controller';
import { PhotoEntity } from './photo.entity';
import { PhotoRepository } from './photo.repository';
import { PhotoService } from './photo.service';
import { ProductService } from '../product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  controllers: [PhotoController],
  providers: [
    PhotoService,
    PhotoRepository,
    ImageService,
    ProductRepository,
    CategoryRepository,
    ProductRepository,
    ProductService,
  ],
})
export class PhotoModule {}
