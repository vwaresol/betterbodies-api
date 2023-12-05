import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderFilterDto } from 'src/dtos/order/order-filter.dto';
import { ProductService } from '../product/product.service';
import { OrderRepository } from './order.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { OrderEntity } from './order.entity';
import { orderErrorsConst } from 'src/const/order.const';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UserEntity } from '../auth/user/user.entity';
import { SubmitOrderDto } from 'src/dtos/order/submit-order.dto';
import { ChangeOrderStatusDto } from 'src/dtos/order/change-order-status.dto';
import { AssignDeliveryManDto } from 'src/dtos/order/assign-delivery-man.dto';
import { OrderStatusEnum } from 'src/enums/order-status.enum';
import { ItemCartDto } from 'src/dtos/order/item-cart.dto';
import { PaymentService } from './payment/payment.service';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { UpdatePaymentDto } from 'src/dtos/order/order-update-payment.dto';
import { OrderStatusEntity } from './order-status/order-status.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    private productService: ProductService,
    private configService: ConfigService,
    private paymentService: PaymentService,
  ) {}

  getOrders(
    orderFilterDto: OrderFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    return this.orderRepository.getOrders(orderFilterDto, paginationOpts);
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository
      .findOne({
        where: { id },
        join: {
          alias: 'order',
          leftJoinAndSelect: {
            status: 'order.status',
            orderDetails: 'order.orderDetails',
            products: 'orderDetails.product',
            user: 'order.user',
            userProfile: 'user.userProfile',
            phone: 'userProfile.phone',
            address: 'order.address',
            payments: 'order.payments',
          },
        },
        withDeleted: true,
      })
      .catch((error) => {
        throw new ConflictException(error.originalError);
      });

    if (!order) {
      throw new NotFoundException(orderErrorsConst.ERROR_ORDER_NOT_FOUND);
    }

    return order;
  }

  async getOrderHistoryByUserId(id: string): Promise<OrderEntity[]> {
    return await this.orderRepository
      .find({
        where: { user: { id } },
        relations: ['user', 'status', 'orderDetails', 'orderDetails.product'],
        take: 5,
        order: {
          id: 'DESC',
        },
      })
      .catch((error) => {
        throw new ConflictException(error.originalError);
      });
  }

  async createOrder(
    @GetUser() user: UserEntity,
    order: SubmitOrderDto,
  ): Promise<any> {
    let paymentData: any = {};
    const orderPreProcessed = await this.preProcessOrder(order);

    const orderSaved = await this.orderRepository.saveOrder(
      orderPreProcessed,
      user,
    );

    if (order.paymentMethod === PaymentMethodEnum.AUTORIZENET)
      paymentData = await this.paymentService.createPaymentAuthorizenet(
        orderSaved,
        user,
        order.paymentMethod,
        order.cardNumber,
        order.expiryDate,
        order.cvc,
      );
    else
      paymentData = await this.paymentService.createPaymentPaypal(
        orderSaved,
        order.paymentMethod,
        order.referenceId,
        order.status,
      );

    if (paymentData.error) {
      const response = { orderId: orderSaved.id };
      throw new ConflictException(JSON.stringify(response));
    }

    return orderSaved;
  }

  async updatePayment(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
    @GetUser() user: UserEntity,
  ): Promise<OrderEntity> {
    // recuperar orden
    const order = await this.getOrderById(id);
    let paymentData: any = {};
    if (updatePaymentDto.paymentMethod === PaymentMethodEnum.AUTORIZENET)
      paymentData = await this.paymentService.createPaymentAuthorizenet(
        order,
        user,
        updatePaymentDto.paymentMethod,
        '',
        '',
        '',
      );
    else
      paymentData = await this.paymentService.createPaymentPaypal(
        order,
        updatePaymentDto.paymentMethod,
        '',
        '',
      );

    if (paymentData.error) {
      const response = { order: order.id };
      throw new ConflictException(JSON.stringify(response));
    }

    // decidir si es paypal o tarjeta
    // si es error regresar un 409 con json stringify que contenga el id de la orden
    // si es exitoso actualizar orden con id de pago
    // retornar order
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepository
      .findOne({ where: { id } })
      .catch((error) => {
        throw new ConflictException(error.originalError);
      });

    if (!order) {
      throw new NotFoundException(orderErrorsConst.ERROR_ORDER_NOT_FOUND);
    }

    await this.orderRepository.softDelete(order.id);
  }

  async changeOrderStatus(
    id: string,
    changeOrderStatus: ChangeOrderStatusDto,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.changeOrderStatus(
      id,
      changeOrderStatus,
      user,
    );
    return order;
  }

  assignDeliveryMan(assignDeliveryMan: AssignDeliveryManDto): Promise<void> {
    return this.orderRepository.assignDeliveryMan(assignDeliveryMan);
  }

  async getOrdersByDeliveryMan(id: string): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      where: {
        deliveryUser: { id },
        status: { status: OrderStatusEnum.ON_TRANSIT },
      },
      relations: ['status'],
    });
  }

  // private preProcessPayment(
  //   result: Stripe.Response<Stripe.PaymentIntent>,
  // ): PaymentResultDto {
  //   return {
  //     transactionId: result.id,
  //     transactionStatus: result.status,
  //     statusCode: '200',
  //     message: `Pago : ${result.id}  Procesado Correctamente | Total : $${(
  //       result.amount / 100
  //     ).toFixed(2)} | Moneda: ${result.currency} | Creado : ${
  //       result.created
  //     } | Metodo de Pago : ${result.payment_method}`,
  //   };
  // }

  private async preProcessOrder(order: SubmitOrderDto) {
    order.cart = await this.productService.processProducts(order.cart);
    order.total = this.getTotalOrder(order.cart);
    order.shipping = 0;
    order.subTotal =
      Math.ceil(
        ((order.total * 100) /
          (100 + parseInt(this.configService.get('TAXES')))) *
          100,
      ) / 100;
    order.taxes = Math.ceil((order.total - order.subTotal) * 100) / 100;
    if (order.addressId === null || order.total < 1000) {
      // order.addressId = null;
      order.picked = true;
    }

    return order;
  }

  private getTotalOrder(products: ItemCartDto[]): number {
    return products.reduce((total, item): number => {
      const totalOrder = total + item.total * item.price;
      return Math.floor(totalOrder * 100) / 100;
    }, 0);
  }

  // private setInvoiceData(orderSaved, orderPreProcessed) {
  //   return {
  //     customer: orderSaved.user,
  //     number: orderSaved.orderNumber,
  //     total: orderPreProcessed.total,
  //     subtotal: orderPreProcessed.subTotal,
  //     tax: orderPreProcessed.taxes,
  //     date: orderSaved.created_at,
  //     cart: orderPreProcessed.cart,
  //   };
  // }

  getStatus(): Promise<OrderStatusEntity[]> {
    return this.orderRepository.getStatus();
  }
}
