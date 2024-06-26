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

  @MinLength(1)
  @MaxLength(100)
  city: string;

  @MinLength(1)
  @MaxLength(100)
  state: string;

  @MinLength(1)
  @MaxLength(6)
  zipCode: string;

  @IsBoolean()
  main: boolean;

  @IsBoolean()
  billingAddress: boolean;
}
