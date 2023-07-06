import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentResponseDTO {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  transactionStatus: string;

  @IsOptional()
  @IsString()
  textCode?: string;
}
