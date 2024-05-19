import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryImageServiceInterface } from 'src/interfaces/gallery-image/gallery-image-service.interface';
import { GalleryImageRepository } from './gallery-image.repository';
import { GalleryImageFilterDto } from 'src/dtos/gallery-image/gallery-image-filter.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { GalleryImageEntity } from './gallery-image.entity';

@Injectable()
export class GalleryImageService implements GalleryImageServiceInterface {
  constructor(
    @InjectRepository(GalleryImageRepository)
    private galleryImageRepository: GalleryImageRepository,
  ) {}

  getImages(
    galleryImageFilterDto: GalleryImageFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryImageEntity>> {
    return this.galleryImageRepository.getImages(
      galleryImageFilterDto,
      paginationOpts,
    );
  }
}
