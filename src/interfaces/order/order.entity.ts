import { OrderFilterDto } from 'src/dtos/order/order-filter.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { OrderEntity } from 'src/modules/order/order.entity';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { SubmitOrderDto } from 'src/dtos/order/submit-order.dto';
import { ChangeOrderStatusDto } from 'src/dtos/order/change-order-status.dto';
import { AssignDeliveryManDto } from 'src/dtos/order/assign-delivery-man.dto';
import { ConfigService } from '@nestjs/config';
import { UpdatePaymentDto } from 'src/dtos/order/order-update-payment.dto';

export interface OrderServiceInterface {
  getOrders(
    filters: OrderFilterDto,
    paginateOpts: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>>;
  getOrderById(id: string): Promise<OrderEntity>;
  createOrder(
    user: UserEntity,
    order: SubmitOrderDto,
    configService: ConfigService,
  ): Promise<OrderEntity>;
  changeOrderStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
    user: UserEntity,
  ): Promise<any>;
  getOrderHistoryByUserId(userId: string): Promise<OrderEntity[]>;
  deleteOrder(id: string): Promise<void>;
  assignDeliveryMan(assignDeliveryMan: AssignDeliveryManDto): Promise<void>;
  getOrdersByDeliveryMan(id: string): Promise<OrderEntity[]>;
  updatePayment(
    id: string,
    updatePaymen: UpdatePaymentDto,
    user: UserEntity,
  ): Promise<OrderEntity[]>;
}
