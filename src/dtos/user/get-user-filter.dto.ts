import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetUserFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;

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
