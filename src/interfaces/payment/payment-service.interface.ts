import { PaymentResponseDTO } from 'src/dtos/payment/payment-response.dto';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { OrderEntity } from 'src/modules/order/order.entity';
import { PaymentEntity } from 'src/modules/order/payment/payment.entity';
import { PhoneEntity } from 'src/modules/user-profile/phone/phone.entity';

export interface PaymentServiceInterface {
  getPayment(id: string): Promise<PaymentEntity>;
  createPayment(
    order: OrderEntity,
    paymentResponseDTO: PaymentResponseDTO,
    paymentMethodEnum: PaymentMethodEnum,
  ): Promise<PaymentEntity>;
  createPaymentAuthorizenet(
    order: OrderEntity,
    user: UserEntity,
    phone: PhoneEntity,
    paymentMethod: PaymentMethodEnum,
    cardNumber: string,
    expiryDate: string,
    cvc: string,
    billingAddressId: string,
  ): Promise<PaymentEntity | object>;
  createPaymentPaypal(
    order: OrderEntity,
    paymentMethod: PaymentMethodEnum,
    referenceId: string,
    status: string,
  ): Promise<PaymentEntity | object>;
}
