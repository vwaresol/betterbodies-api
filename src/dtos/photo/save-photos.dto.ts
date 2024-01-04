import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { SavePhotoDto } from './save-photo.dto';

export class SavePhotosArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SavePhotoDto)
  photos: SavePhotoDto[];
}
