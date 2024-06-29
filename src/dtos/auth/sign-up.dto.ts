import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEmailExists } from 'src/decorators/email-user.decorator';

export class SignupDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(100)
  @UserEmailExists()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is to week',
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  motherLastName?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(13)
  @IsOptional()
  role?: string;
}
