import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from 'src/dtos/gallery/create-gallery.dto';
import { UpdateGalleryDto } from 'src/dtos/gallery/update-gallery.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GalleryEntity } from './gallery.entity';
import { ConfigService } from '@nestjs/config';

@Controller('gallery')
export class GalleryController {
  constructor(
    private galleryService: GalleryService,
    private configService: ConfigService,
  ) {}

  @Get('/')
  get(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Pagination<GalleryEntity>> {
    limit = !limit ? '80' : limit;
    return this.galleryService.getGallery({
      page,
      limit,
      route: this.configService.get('HOST'),
    });
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.galleryService.getGalleryId(id);
  }

  @Post('/create')
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.createGallery(createGalleryDto);
  }

  @Put('/:id/update')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.updateGallery(updateGalleryDto, id);
  }

  @Delete('/delete/:id')
  @HttpCode(204)
  delete(@Param('id') id: string): Promise<void> {
    return this.galleryService.deleteGallery(id);
  }
}
