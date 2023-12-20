import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { DeletePhotoDto } from 'src/dtos/photo/delete-photo.dto';
import { SavePhotosArrayDto } from 'src/dtos/photo/save-photos.dto';

@Controller('photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadedPhoto(@UploadedFile() file): Promise<any> {
    return this.photoService.savePhoto(file);
  }

  @Post('/:productId/multiple')
  async uploadPhotos(
    @Body() files: SavePhotosArrayDto,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.photoService.savePhotos(files, productId);
  }

  @Get(':photo')
  async getPhoto(@Param('photo') photo: string, @Res() res): Promise<string> {
    const path = await this.photoService.getPhoto(photo);
    return res.sendFile(photo, { root: path });
  }

  @Get('thumbnail/:photo')
  async getThumbnail(
    @Param('photo') photo: string,
    @Res() res,
  ): Promise<string> {
    const path = await this.photoService.getPhoto(photo, '/thumbnail');
    return res.sendFile(photo, { root: path });
  }

  @Delete(':photoId')
  async delete(@Param() deletePhotoDto: DeletePhotoDto): Promise<void> {
    return this.photoService.deletePhoto(deletePhotoDto);
  }
}
