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
  @IsNotEmpty()
  code: string;

  @MinLength(5)
  @MaxLength(10)
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  main: boolean;
}
