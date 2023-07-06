import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentResultDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  transactionStatus: string;

  @IsNotEmpty()
  @IsString()
  statusCode: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
