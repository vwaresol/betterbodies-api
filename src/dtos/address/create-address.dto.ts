import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  receipter: string;

  @MinLength(1)
  @MaxLength(100)
  street: string;

  @IsOptional()
  @MaxLength(10)
  intNumber: string;

  @MinLength(1)
  @MaxLength(10)
  extNumber: string;

  @MinLength(1)
  @MaxLength(100)
  suburb: string;

  @MinLength(1)
  @MaxLength(100)
  city: string;

  @MinLength(1)
  @MaxLength(100)
  state: string;

  @MinLength(1)
  @MaxLength(5)
  zipCode: string;

  @IsBoolean()
  main: boolean;

  @IsBoolean()
  billingAddress: boolean;
}
