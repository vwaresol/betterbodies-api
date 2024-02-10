import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { paymentErrorsConst } from 'src/const/payment.conts';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../order.entity';
import { PaymentEntity } from './payment.entity';
import { PaymentResponseDTO } from 'src/dtos/payment/payment-response.dto';
@Injectable()
export class PaymentRepository extends Repository<PaymentEntity> {
  constructor(dataSource: DataSource) {
    super(PaymentEntity, dataSource.createEntityManager());
  }
  async createPayment(
    order: OrderEntity,
    paymentData: PaymentResponseDTO,
    paymentMethod: PaymentMethodEnum,
  ): Promise<PaymentEntity> {
    const payment = this.create({
      referenceId: paymentData.transactionId,
      status: paymentData.transactionStatus,
      textCode: paymentData.textCode && paymentData.textCode,
      paymentMethod: paymentMethod,
      order,
    });

    try {
      await this.save(payment);
      return payment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        paymentErrorsConst.ERROR_CREATING_PAYMENT,
      );
    }
  }
}
