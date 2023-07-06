import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  @MinLength(4)
  username: string;

  @IsString()
  password: string;
}
