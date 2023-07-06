import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/dtos/auth/auth-credentials.dto';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { RefreshTokenDto } from 'src/dtos/refresh-token/refresh-token.dto';
import { JwtPayload } from 'src/interfaces/jwt/jwt-payload.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signupDto: SignupDto): Promise<JwtPayload> {
    return this.authService.signUp(signupDto);
  }

  @Post('/sign-in')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/refresh')
  public async refresh(@Body() body: RefreshTokenDto): Promise<JwtPayload> {
    return this.authService.refresh(body.refreshToken);
  }
}
