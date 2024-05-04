import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryEntity } from './gallery.entity';
import { GalleryController } from './gallery.controller';
import { GalleryRepository } from './gallery.repository';
import { GalleryService } from './gallery.service';
import { CategoryService } from '../product/category/category.service';
import { CategoryRepository } from '../product/category/cateogory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryEntity])],
  controllers: [GalleryController],
  providers: [
    GalleryRepository,
    GalleryService,
    CategoryService,
    CategoryRepository,
  ],
  exports: [],
})
export class GalleryModule {}
