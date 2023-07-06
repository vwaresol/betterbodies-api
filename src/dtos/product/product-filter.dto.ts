import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  cat?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8)
  column: string;

  @IsString()
  @IsOptional()
  @MaxLength(4)
  sort: any;
}
