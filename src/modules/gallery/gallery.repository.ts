import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GalleryEntity } from './gallery.entity';
import { CategoryEntity } from '../product/category/category.entity';
import { UpdateGalleryDto } from 'src/dtos/gallery/update-gallery.dto';
import { galleryErrorsConst } from 'src/const/gallery.const';
import { CategoryRepository } from '../product/category/cateogory.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class GalleryRepository extends Repository<GalleryEntity> {
  constructor(
    dataSource: DataSource,
    private categoriesRepository: CategoryRepository,
  ) {
    super(GalleryEntity, dataSource.createEntityManager());
  }

  async getGallery(
    paginateOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryEntity>> {
    const query = this.createQueryBuilder('gallery').leftJoinAndSelect(
      'gallery.category',
      'category',
    );

    try {
      return await paginate(query, paginateOpts);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createGallery(name: string, url: string, category: CategoryEntity) {
    const gallery = this.create({ name, url, category });

    try {
      await this.save(gallery);
      return gallery;
    } catch (error) {
      console.log(error);
    }
  }

  async updateGallery(id: string, data: UpdateGalleryDto) {
    const gallery = await this.findOne({ where: { id } });
    const categories = await this.getCategories(data.categoryId);

    if (!gallery) {
      throw new NotFoundException(galleryErrorsConst.ERROR_GALLERY_NOT_FOUND);
    }

    gallery.name = data.name;
    gallery.url = data.url;
    gallery.category = categories;

    this.save(gallery);

    return gallery;
  }

  async getCategories(id: string): Promise<CategoryEntity> {
    return await this.categoriesRepository.findOne({
      where: { id },
    });
  }
}
