import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AssignDeliveryManDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  orderId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  userId: string;
}
