import { IsOptional, IsString } from 'class-validator';

export class SavePhotoDto {
  @IsString()
  @IsOptional()
  productId: string;
}
