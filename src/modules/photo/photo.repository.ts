import { Injectable, NotFoundException } from '@nestjs/common';
import { photoErrorsConst } from 'src/const/photo.const';
import { productErrorsConst } from 'src/const/product.const';
import { DeletePhotoDto } from 'src/dtos/photo/delete-photo.dto';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { ProductRepository } from '../product/product.repository';
import { PhotoEntity } from './photo.entity';

@Injectable()
export class PhotoRepository extends Repository<PhotoEntity> {
  constructor(
    dataSource: DataSource,
    private productRepository: ProductRepository,
  ) {
    super(PhotoEntity, dataSource.createEntityManager());
  }

  async savePhoto(file): Promise<PhotoEntity> {
    const photo = this.create({
      name: file.filename,
    });

    await this.save(photo);

    return photo;
  }

  async savePhotos(files, product: ProductEntity): Promise<PhotoEntity[]> {
    const photos = [];

    for (const file of files.photos) {
      const photo = this.create({
        name: file.fileName,
        product: product,
      });

      photos.push(photo);
    }

    await this.save(photos);

    return photos;
  }

  async getPhoto(deletePhotoDto: DeletePhotoDto): Promise<PhotoEntity> {
    const photo = await this.findOne({
      where: {
        id: deletePhotoDto.photoId,
      },
      // relations: ['product'],
    });

    if (!photo) {
      throw new NotFoundException(photoErrorsConst.ERROR_PHOTO_NOT_FOUNDL);
    }

    return photo;
  }

  async getProduct(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(productErrorsConst.ERROR_PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
