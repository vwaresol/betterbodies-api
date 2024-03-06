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
  @IsOptional()
  @IsString()
  addressId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  referenceId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cvc: string;

  @IsNotEmpty()
  @IsString()
  billingAddressId: string;

  @IsOptional()
  @IsNotEmpty()
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
