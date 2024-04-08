import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  @IsOptional()
  code: string;

  @MinLength(5)
  @MaxLength(15)
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  main: boolean;
}
