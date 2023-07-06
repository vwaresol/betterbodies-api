import { IsOptional, IsString, MaxLength } from 'class-validator';

export class OrderFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8)
  column: string;

  @IsString()
  @IsOptional()
  @MaxLength(4)
  sort: any;
}
