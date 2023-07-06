import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePhotoDto {
 // @IsString()
 // @IsOptional()
 // productId: string;

  @IsString()
  @IsNotEmpty()
  photoId: string;
}
