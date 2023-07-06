import { ConflictException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { ImageServiceInterface } from './image-service.interface';
import { PhotoEntity } from 'src/modules/photo/photo.entity';
@Injectable()
export class ImageService implements ImageServiceInterface<any> {
  async createThumbnail(file: any): Promise<void> {
    const dir = `./files/products/thumbnail/`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    sharp(file.path)
      .resize(200)
      .toFile(dir + file.filename)
      .then(() => {
        if (fs.existsSync(file.path)) {
          this.unlinkImage(file.path);
        }
      });
  }

  async createImage(file: any): Promise<void> {
    const dir = `./files/products/`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    sharp(file.path)
      .resize(1920, 1080, {
        fit: 'contain',
        position: 'center',
      })
      .toFile(dir + file.filename)
      .then(() => {
        if (fs.existsSync(file.path)) {
          this.unlinkImage(file.path);
        }
      });
  }

  async deletePhotos(photo: PhotoEntity): Promise<void> {
    const path = `./files/product/`;
    const images = [];

    images.push(`${path}/${photo.name}`);
    images.push(`${path}/thumbnail/${photo.name}`);

    images.forEach((image) => {
      this.unlinkImage(image);
    });
  }

  private unlinkImage(path: string): void {
    fs.unlink(path, (error) => {
      if (error) {
        throw new ConflictException('Error unlinking file');
      }
    });
  }
}
