import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { GalleryImageFilterDto } from 'src/dtos/gallery-image/gallery-image-filter.dto';
import { GalleryImageEntity } from 'src/modules/image/gallery-image.entity';

export interface GalleryImageServiceInterface {
  getImages(
    gallerytFilterDto: GalleryImageFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<GalleryImageEntity>>;
}
