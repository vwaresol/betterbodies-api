import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryRepository } from './gallery.repository';
import { GalleryServiceInterface } from 'src/interfaces/gallery/gallery-service.interface';
import { CreateGalleryDto } from 'src/dtos/gallery/create-gallery.dto';
import { CategoryService } from '../product/category/category.service';
import { UpdateGalleryDto } from 'src/dtos/gallery/update-gallery.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { GalleryEntity } from './gallery.entity';

@Injectable()
export class GalleryService implements GalleryServiceInterface {
  constructor(
    @InjectRepository(GalleryRepository)
    private galleryRepository: GalleryRepository,
    private categoryService: CategoryService,
  ) {}

  getGallery(
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryEntity>> {
    return this.galleryRepository.getGallery(paginationOpts);
  }

  async getGalleryId(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!gallery) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return gallery;
  }

  async createGallery({ categoryId, ...createGalleryDto }: CreateGalleryDto) {
    const categoy = await this.categoryService.getCategoryId(categoryId);

    const gallery = await this.galleryRepository.createGallery(
      createGalleryDto.name,
      createGalleryDto.url,
      categoy,
    );

    return gallery;
  }

  async updateGallery(updateGalleryDto: UpdateGalleryDto, id: string) {
    return await this.galleryRepository.updateGallery(id, updateGalleryDto);
  }

  async deleteGallery(id: string): Promise<void> {
    await this.getGalleryId(id);

    await this.galleryRepository.softDelete(id);
  }
}
