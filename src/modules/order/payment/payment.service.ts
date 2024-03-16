import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentServiceInterface } from 'src/interfaces/payment/payment-service.interface';
import { OrderEntity } from '../order.entity';
import { PaymentEntity } from './payment.entity';
import { PaymentRepository } from './payment.repository';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { APIContracts, APIControllers, Constants } from 'authorizenet';
import { PaymentResponseDTO } from 'src/dtos/payment/payment-response.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { AddressEntity } from 'src/modules/user-profile/address/address.entity';
import { AddressService } from 'src/modules/user-profile/address/address.service';
import { PhoneEntity } from 'src/modules/user-profile/phone/phone.entity';
@Injectable()
export class PaymentService implements PaymentServiceInterface {
  constructor(
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
    private addresService: AddressService,
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
    phone: PhoneEntity,
    paymentMethod: PaymentMethodEnum,
    cardNumber: string,
    expiryDate: string,
    cvc: string,
    billingAddressId: string,
  ): Promise<PaymentEntity | object> {
    const billingAddress = await this.addresService.getAddressById(
      billingAddressId,
    );

    const response: any = await this.chargeCreditCard(
      order,
      user,
      phone,
      cardNumber,
      expiryDate,
      cvc,
      billingAddress,
    );

    const data = response?.data;
    const paymentData: PaymentResponseDTO = {
      transactionId: data[0],
      transactionStatus: data[1],
      textCode: data[2],
    };

    const payment = await this.paymentRepository.createPayment(
      order,
      paymentData,
      paymentMethod,
    );

    if (response.error) {
      return response;
    }
    return payment;
  }

  async chargeCreditCard(
    order: OrderEntity,
    user: UserEntity,
    phone: PhoneEntity,
    cardNumber: string,
    expiryDate: string,
    cvc: string,
    billingAddress: AddressEntity,
  ) {
    const merchantAuthenticationType =
      new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      this.configService.get('AUTHORIZENET_NAME'),
    );
    merchantAuthenticationType.setTransactionKey(
      this.configService.get('AUTHORIZENET_KEY'),
    );
    console.log(this.configService.get('AUTHORIZENET_NAME'));
    console.log(this.configService.get('AUTHORIZENET_KEY'));
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
    billTo.setAddress(billingAddress.street);
    billTo.setCity(billingAddress.city);
    billTo.setState(billingAddress.state);
    billTo.setZip(billingAddress.zipCode);
    billTo.setPhoneNumber(phone.phone);
    billTo.setEmail(user.username);

    const lineItemList = [];
    for (const { product, ...details } of order.orderDetails) {
      const lineItemId = new APIContracts.LineItemType();
      const partes = product.id.split('-');
      const descriptionProduct = product.description;
      const descriptionLimit = descriptionProduct.substring(0, 39);
      if (product.name.length > 31) {
        lineItemId.setName(product.name.substring(0, 31));
      } else {
        lineItemId.setName(product.name);
      }
      lineItemId.setItemId(partes[4]);
      lineItemId.setDescription(descriptionLimit);
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

    const ctrl = new APIControllers.CreateTransactionController(
      createRequest.getJSON(),
    );
    console.log(
      'IS PRODUCTION',
      this.configService.get('AUTHORIZENET_ENV') === 'PRODUCTION'
        ? 'PROD'
        : 'sandbox',
    );
    ctrl.setEnvironment(
      this.configService.get('AUTHORIZENET_ENV') === 'PRODUCTION'
        ? Constants.endpoint.production
        : Constants.endpoint.sandbox,
    );

    let data: string[];
    return new Promise(function (resolve) {
      ctrl.execute(function () {
        const APIResponse = ctrl.getResponse();
        const response = new APIContracts.CreateTransactionResponse(
          APIResponse,
        );
        if (response != null) {
          if (
            response.getMessages().getResultCode() ==
            APIContracts.MessageTypeEnum.OK
          ) {
            if (response.getTransactionResponse().getMessages() != null) {
              data = [
                response.getTransactionResponse().getTransId(),
                response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getCode(),
                response.getTransactionResponse().getResponseCode(),
              ];

              return resolve({ data: data, error: false });
            } else {
              console.log('Failed Transaction.', response.messages);
              if (response.getTransactionResponse().getErrors()) {
                const error = response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0];

                data = [
                  response.getTransactionResponse().getTransId(),
                  error.errorCode,
                  error.errorText,
                ];
                return resolve({ data: data, error: true });
              }
            }
          } else {
            console.log(response.messages.message);
            data = [
              0,
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode(),
              response.getTransactionResponse().getResponseCode(),
            ];
            return resolve({ data: data, error: false });
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
