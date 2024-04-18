import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CreateGalleryDto } from 'src/dtos/gallery/create-gallery.dto';
import { GalleryFilterDto } from 'src/dtos/gallery/gallery-filter.dto';
import { UpdateGalleryDto } from 'src/dtos/gallery/update-gallery.dto';
import { GalleryEntity } from 'src/modules/gallery/gallery.entity';

export interface GalleryServiceInterface {
  getGallery(
    gallerytFilterDto: GalleryFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryEntity>>;
  getGalleryId(id: string);
  createGallery(createGalleryDto: CreateGalleryDto);
  updateGallery(updateGalleryDto: UpdateGalleryDto, id: string);
  deleteGallery(id: string): Promise<void>;
}
