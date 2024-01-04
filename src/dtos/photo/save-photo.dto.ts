import { IsOptional, IsString } from 'class-validator';

export class SavePhotoDto {
  @IsString()
  @IsOptional()
  fileName: string;
}
