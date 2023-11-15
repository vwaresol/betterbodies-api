import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentServiceInterface } from 'src/interfaces/payment/payment-service.interface';
import { OrderEntity } from '../order.entity';
import { PaymentEntity } from './payment.entity';
import { PaymentRepository } from './payment.repository';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { APIContracts } from 'authorizenet';
import { APIControllers } from 'authorizenet';
import { PaymentResponseDTO } from 'src/dtos/payment/payment-response.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
@Injectable()
export class PaymentService implements PaymentServiceInterface {
  constructor(
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
    private configService: ConfigService,
  ) {}

  getPayment(id: string): Promise<PaymentEntity> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  createPayment(
    order: OrderEntity,
    responseDtos: PaymentResponseDTO,
    paymentMethodEnum: PaymentMethodEnum,
  ): Promise<PaymentEntity> {
    return this.paymentRepository.createPayment(
      order,
      responseDtos,
      paymentMethodEnum,
    );
  }

  async createPaymentAuthorizenet(
    order: OrderEntity,
    user: UserEntity,
    paymentMethod: PaymentMethodEnum,
    cardNumber: string,
    expiryDate: string,
    cvc: string,
  ): Promise<PaymentEntity | object> {
    const response = await this.chargeCreditCard(
      order,
      user,
      cardNumber,
      expiryDate,
      cvc,
    );
    const paymentData: PaymentResponseDTO = {
      transactionId: response[0],
      transactionStatus: response[1],
      textCode: response[2],
    };

    if (
      ['2', '3', '4', '5', '6', '7', '8', '10', '16'].includes(
        paymentData.transactionStatus,
      )
    )
      return { error: true };
    const payment = await this.paymentRepository.createPayment(
      order,
      paymentData,
      paymentMethod,
    );
    return payment;
  }

  async chargeCreditCard(
    order: OrderEntity,
    user: UserEntity,
    cardNumber: string,
    expiryDate: string,
    cvc: string,
  ) {
    const merchantAuthenticationType =
      new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      this.configService.get('AUTHORIZENET_NAME'),
    );
    merchantAuthenticationType.setTransactionKey(
      this.configService.get('AUTHORIZENET_KEY'),
    );
    const creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber(cardNumber.replace(/\s+/g, ''));
    creditCard.setExpirationDate(
      expiryDate.split('/').join('').replace(/\s+/g, ''),
    );
    creditCard.setCardCode(cvc);

    const paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    const orderDetails = new APIContracts.OrderType();
    orderDetails.setInvoiceNumber(order.orderNumber);
    orderDetails.setDescription('Product Description');

    const tax = new APIContracts.ExtendedAmountType();
    tax.setAmount('16');
    tax.setName('IVA');

    const duty = new APIContracts.ExtendedAmountType();
    duty.setAmount(order.total);
    duty.setName(this.configService.get('CLIENT_NAME'));

    const shipping = new APIContracts.ExtendedAmountType();
    shipping.setAmount(order.total);
    shipping.setName(this.configService.get('CLIENT_NAME'));

    const billTo = new APIContracts.CustomerAddressType();
    billTo.setFirstName(user.userProfile.name);
    billTo.setLastName(user.userProfile.lastName);
    // billTo.setCompany('Vware');
    billTo.setAddress(order.address.street);
    billTo.setCity(order.address.city);
    billTo.setState(order.address.state);
    billTo.setZip(order.address.zipCode);
    // billTo.setCountry('Tecate');
    billTo.setPhoneNumber('12345667');
    // billTo.setFaxNumber('12345');
    billTo.setEmail(user.username);

    const lineItemList = [];
    for (const { product, ...details } of order.orderDetails) {
      const lineItemId = new APIContracts.LineItemType();
      const partes = product.id.split('-');
      if (product.name.length > 31) {
        lineItemId.setName(product.name.substring(0, 31));
      } else {
        lineItemId.setName(product.name);
      }
      lineItemId.setItemId(partes[4]);
      lineItemId.setDescription(product.description);
      lineItemId.setQuantity(details.quantity.toString());
      lineItemId.setUnitPrice(Number(details.salePrice));
      lineItemList.push(lineItemId);
    }
    const lineItems = new APIContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    const transactionSetting1 = new APIContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    const transactionSetting2 = new APIContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    const transactionSettingList = [];
    transactionSettingList.push(transactionSetting1);
    transactionSettingList.push(transactionSetting2);

    const transactionSettings = new APIContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    const transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(
      APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION,
    );
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(order.total);
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setTax(tax);
    transactionRequestType.setDuty(duty);
    transactionRequestType.setShipping(shipping);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    console.log('REQUEST', JSON.stringify(createRequest.getJSON(), null, 2));

    const ctrl = new APIControllers.CreateTransactionController(
      createRequest.getJSON(),
    );

    let data: string[];
    return new Promise(function (resolve) {
      ctrl.execute(function () {
        const APIResponse = ctrl.getResponse();
        const response = new APIContracts.CreateTransactionResponse(
          APIResponse,
        );

        
        console.log('RESPPONSE', JSON.stringify(response, null, 4));


        if (response != null) {
          if (
            response.getMessages().getResultCode() ==
            APIContracts.MessageTypeEnum.OK
          ) {
            if (response.getTransactionResponse().getMessages() != null) {
              //console.log('response', response);
              data = [
                response.getTransactionResponse().getTransId(),
                response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getCode(),
                response.getTransactionResponse().getResponseCode(),
              ];

              return resolve(data);
            } else {
              console.log('Failed Transaction.');
              if (response.getTransactionResponse().getErrors() != null) {
                data = [
                  response.getTransactionResponse().getTransId(),
                  response
                    .getTransactionResponse()
                    .getErrors()
                    .getError()[0]
                    .getErrorCode(),
                  response.getTransactionResponse().getResponseCode(),
                ];
                return resolve(data);
              }
            }
          } else {
            data = [
              0,
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode(),
              response.getTransactionResponse().getResponseCode(),
            ];

            console.log('error', data);

            return resolve(data);
          }
        }
      });
    });
  }

  //*********   PAYPAL **************
  async createPaymentPaypal(
    order: OrderEntity,
    paymentMethod: PaymentMethodEnum,
    referenceId: string,
    status: string,
  ): Promise<PaymentEntity | object> {
    const paymentData: PaymentResponseDTO = {
      transactionId: referenceId,
      transactionStatus: status,
    };
    const payment = await this.paymentRepository.createPayment(
      order,
      paymentData,
      paymentMethod,
    );
    return payment;
  }
}
