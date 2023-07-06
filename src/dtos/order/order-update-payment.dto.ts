import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaymentMethodEnum } from 'src/enums/payment.enum';

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  card: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  expire: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  cvv: string;
}
