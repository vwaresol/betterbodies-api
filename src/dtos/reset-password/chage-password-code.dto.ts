import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from 'src/decorators/is-equal-to.decorator';

export class ChangePasswordCodeDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is to week',
  })
  password: string;

  @IsEqualTo('password')
  passwordConfirm: string;
}
