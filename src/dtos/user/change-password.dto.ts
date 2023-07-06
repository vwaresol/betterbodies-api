import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from 'src/decorators/is-equal-to.decorator';

export class ChangePasswordDto {
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
