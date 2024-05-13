import { IsOptional, IsString } from 'class-validator';

export class GalleryImageFilterDto {
  @IsOptional()
  @IsString()
  cat?: string;
}
