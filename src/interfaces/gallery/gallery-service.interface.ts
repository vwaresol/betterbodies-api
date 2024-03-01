import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CreateGalleryDto } from 'src/dtos/gallery/create-gallery.dto';
import { UpdateGalleryDto } from 'src/dtos/gallery/update-gallery.dto';
import { GalleryEntity } from 'src/modules/gallery/gallery.entity';

export interface GalleryServiceInterface {
  getGallery(
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryEntity>>;
  getGalleryId(id: string);
  createGallery(createGalleryDto: CreateGalleryDto);
  updateGallery(updateGalleryDto: UpdateGalleryDto, id: string);
  deleteGallery(id: string): Promise<void>;
}
