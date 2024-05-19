import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GalleryImageService } from './gallery-image.service';
import { GalleryImageFilterDto } from 'src/dtos/gallery-image/gallery-image-filter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GalleryImageEntity } from './gallery-image.entity';

@Controller('image')
export class GalleryImageController {
  constructor(
    private galleryImageService: GalleryImageService,
    private configService: ConfigService,
  ) {}

  @Get('/')
  get(
    @Query() galleryImagetFilterDto: GalleryImageFilterDto,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Pagination<GalleryImageEntity>> {
    limit = !limit ? '9' : limit;
    return this.galleryImageService.getImages(galleryImagetFilterDto, {
      page,
      limit,
      route: this.configService.get('HOST'),
    });
  }
}
