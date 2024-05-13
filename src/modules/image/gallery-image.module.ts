import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from '../product/category/category.service';
import { CategoryRepository } from '../product/category/cateogory.repository';
import { GalleryImageEntity } from './gallery-image.entity';
import { GalleryImageController } from './gallery-image.controller';
import { GalleryImageService } from './gallery-image.service';
import { GalleryImageRepository } from './gallery-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryImageEntity])],
  controllers: [GalleryImageController],
  providers: [
    GalleryImageService,
    GalleryImageRepository,
    CategoryService,
    CategoryRepository,
  ],
  exports: [],
})
export class GalleryImageModule {}
