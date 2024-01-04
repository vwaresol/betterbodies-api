import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsString()
  @IsOptional()
  barcode: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsOptional()
  salePrice: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsArray()
  categories: string[];
}
