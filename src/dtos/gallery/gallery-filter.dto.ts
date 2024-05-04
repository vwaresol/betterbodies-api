import { IsOptional, IsString } from 'class-validator';

export class GalleryFilterDto {
  @IsOptional()
  @IsString()
  cat?: string;
}
