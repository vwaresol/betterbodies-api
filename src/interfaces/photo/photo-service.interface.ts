import { DeletePhotoDto } from 'src/dtos/photo/delete-photo.dto';
import { SavePhotoDto } from 'src/dtos/photo/save-photo.dto';
import { SavePhotosArrayDto } from 'src/dtos/photo/save-photos.dto';

export interface PhotoServiceInterface {
  savePhoto(file, savePhotoDto: SavePhotoDto): Promise<any>;
  savePhotos(
    file,
    savePhotoDto: SavePhotosArrayDto,
    productId: string,
  ): Promise<any>;
  getPhoto(file, thumbnail: string): Promise<string>;
  deletePhoto(deletePhotoDto: DeletePhotoDto): Promise<void>;
}
