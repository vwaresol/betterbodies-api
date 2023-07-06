import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SearchProductDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size?: number;
}
