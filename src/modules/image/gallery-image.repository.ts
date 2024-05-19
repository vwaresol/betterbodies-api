import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GalleryImageEntity } from './gallery-image.entity';
import { CategoryRepository } from '../product/category/cateogory.repository';
import { GalleryImageFilterDto } from 'src/dtos/gallery-image/gallery-image-filter.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class GalleryImageRepository extends Repository<GalleryImageEntity> {
  constructor(
    dataSource: DataSource,
    private categoriesRepository: CategoryRepository,
  ) {
    super(GalleryImageEntity, dataSource.createEntityManager());
  }

  async getImages(
    { cat }: GalleryImageFilterDto,
    paginateOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryImageEntity>> {
    const query = this.createQueryBuilder('image').leftJoinAndSelect(
      'image.category',
      'category',
    );

    if (cat) {
      query.andWhere('category.id = :categoryId', { categoryId: cat });
    }

    try {
      return await paginate(query, paginateOpts);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
