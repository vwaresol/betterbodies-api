import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refreshToken: string;
}
