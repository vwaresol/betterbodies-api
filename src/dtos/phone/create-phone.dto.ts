import { IsBoolean, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePhoneDto {
  @MinLength(7)
  @MaxLength(12)
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  main: boolean;
}
