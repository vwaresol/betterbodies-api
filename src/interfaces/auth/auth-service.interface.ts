import { AuthCredentialsDto } from 'src/dtos/auth/auth-credentials.dto';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { JwtPayload } from '../jwt/jwt-payload.interface';

export interface AuthServiceInterface {
  signUp(signUpDto: SignupDto): Promise<JwtPayload>;
  signIn({ username, password }: AuthCredentialsDto): Promise<JwtPayload>;
  // refresh(refreshToken: string): Promise<JwtPayload>;
  // findForUsername(email: string): Promise<User | null>;
  // setPassword(authResetPassword: AuthResetPasswordDto): Promise<User>;
}
