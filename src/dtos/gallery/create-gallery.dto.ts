import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
