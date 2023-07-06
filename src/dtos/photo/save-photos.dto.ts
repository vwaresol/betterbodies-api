import { IsNotEmpty, IsString } from 'class-validator';

export class SavePhotosDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
