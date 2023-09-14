import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @MaxLength(100)
  email: string;
}
