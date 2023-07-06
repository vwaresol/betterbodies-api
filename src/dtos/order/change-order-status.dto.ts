import {
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
  statusId: string;

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
