import { IsString, IsOptional } from 'class-validator';

export class UpdateGalleryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  categoryId: string;
}
