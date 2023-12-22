import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/common/image/image.service';
import { photoErrorsConst } from 'src/const/photo.const';
import { DeletePhotoDto } from 'src/dtos/photo/delete-photo.dto';
import { PhotoServiceInterface } from 'src/interfaces/photo/photo-service.interface';
import { PhotoRepository } from './photo.repository';
import { ProductService } from '../product/product.service';

@Injectable()
export class PhotoService implements PhotoServiceInterface {
  constructor(
    @InjectRepository(PhotoRepository)
    private photoRepository: PhotoRepository,
    private readonly imagesService: ImageService,
    private readonly productService: ProductService,
  ) {}

  async savePhoto(file): Promise<any> {
    await this.imagesService.createThumbnail(file);
    await this.imagesService.createImage(file);

    return this.photoRepository.savePhoto(file);
  }

  async savePhotos(files, productId): Promise<any> {
    const product = await this.productService.getProductById(productId);

    return this.photoRepository.savePhotos(files, product);
  }

  async getPhoto(file: string, thumbnail = ''): Promise<string> {
    const photo = await this.photoRepository.find({
      where: { name: file },
    });

    return `./files/products/thumbnail`;
  }

  async deletePhoto(deletePhotoDto: DeletePhotoDto): Promise<void> {
    const photo = await this.photoRepository.getPhoto(deletePhotoDto);

    const rows = await this.photoRepository.delete(photo.id);

    if (rows.affected === 0) {
      throw new ConflictException(photoErrorsConst.ERROR_SAVING_PHOTO);
    }

    this.imagesService.deletePhotos(photo);
  }
}
