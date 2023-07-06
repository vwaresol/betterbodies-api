import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  motherLastName?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  companyName?: string;
}
