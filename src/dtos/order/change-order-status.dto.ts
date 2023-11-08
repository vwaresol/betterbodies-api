import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangeOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  status_id: string;

  @IsOptional()
  @IsString()
  trackingName: string;

  @IsOptional()
  @IsString()
  trackingNumber: string;

  @IsOptional()
  @IsDateString()
  trackingDate: Date;

  @IsOptional()
  @IsString()
  @MinLength(5, {
    message: 'The comment is too short',
  })
  @MaxLength(250, {
    message: 'The comment is too long',
  })
  comment?: string;
}
