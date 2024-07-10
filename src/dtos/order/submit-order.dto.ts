import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { ItemCartDto } from './item-cart.dto';
import { PaymentResultDto } from './payment-result.dto';

export class SubmitOrderDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  addressId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  phoneId: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  paymentMethodId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  referenceId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cvc: string;

  @IsOptional()
  @IsString()
  billingAddressId: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ItemCartDto)
  cart: ItemCartDto[];

  @IsOptional()
  subTotal: number;

  @IsOptional()
  taxes: number;

  @IsOptional()
  total: number;

  @IsOptional()
  shipping: number;

  @IsOptional()
  picked: boolean;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentResultDto)
  payment: PaymentResultDto;
}
