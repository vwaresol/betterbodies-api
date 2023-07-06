import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemCartDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  sku: string;

  @IsOptional()
  barcode: string;

  @IsOptional()
  price: number;

  @IsOptional()
  salePrice: number;

  @IsOptional()
  quantity: number;
}
