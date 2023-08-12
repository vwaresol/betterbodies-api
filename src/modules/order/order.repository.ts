import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { addressErrorsConst } from 'src/const/address.const';
import { columnsSort, orderErrorsConst } from 'src/const/order.const';
import { SubmitOrderDto } from 'src/dtos/order/submit-order.dto';
import { OrderStatusEnum } from 'src/enums/order-status.enum';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../auth/user/user.entity';
import { AddressEntity } from '../user-profile/address/address.entity';
import { AddressRepository } from '../user-profile/address/address.repository';
import { OrderCommentRepository } from './order-comment/order-comment.repository';
import { OrderStatusEntity } from './order-status/order-status.entity';
import { OrderStatusRepository } from './order-status/order-status.repository';
import { OrderEntity } from './order.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { OrderFilterDto } from 'src/dtos/order/order-filter.dto';
import { ChangeOrderStatusDto } from 'src/dtos/order/change-order-status.dto';
import { OrderCommentEntity } from './order-comment/order-comment.entity';
import { AssignDeliveryManDto } from 'src/dtos/order/assign-delivery-man.dto';
import { UserRepository } from '../auth/user/user.repository';
import { userErrorsConst } from 'src/const/user.const';
import { ItemCartDto } from 'src/dtos/order/item-cart.dto';
import { OrderDetailEntity } from './order-detail/order-detail.entity';
import { OrderDetailRepository } from './order-detail/order-detail.repository';
import { ProductRepository } from '../product/product.repository';
import { PaymentEntity } from './payment/payment.entity';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    dataSource: DataSource,
    private orderStatusRespository: OrderStatusRepository,
    private addressRepository: AddressRepository,
    private orderCommentRepository: OrderCommentRepository,
    private userRepository: UserRepository,
    private orderDetailRepository: OrderDetailRepository,
    private productRepository: ProductRepository,
  ) {
    super(OrderEntity, dataSource.createEntityManager());
  }

  async saveOrder(
    orderSubmitted: SubmitOrderDto,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const status = await this.getOrderStatus(OrderStatusEnum.ON_PROCESS);
    const address = await this.getAddress(orderSubmitted.addressId);

    const comment = this.createOrderComment(orderSubmitted.comment, user);
    const orderDetails = this.processDetails(orderSubmitted.cart);

    const order = this.create({
      ...orderSubmitted,
      status,
      address,
      user,
      orderDetails,
      comments: [comment],
    });

    try {
      await this.save(order);
      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        orderErrorsConst.ERROR_CREATING_ORDER,
      );
    }
  }

  async getOrders(
    { status, search, column, sort }: OrderFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('user.userProfile', 'userInfo')
      .leftJoinAndSelect('userInfo.phone', 'phone')
      .where({});

    if (status) {
      query.andWhere('order.statusId = :status', { status });
    }

    if (search) {
      query.andWhere('order.orderNumber = :search', { search });
    }

    if (column && sort) {
      query.addOrderBy(columnsSort[column], sort);
    }

    try {
      return await paginate(query, paginationOpts);
    } catch (error) {
      console.log('Despues del error');

      console.log(error);
      throw new InternalServerErrorException(
        orderErrorsConst.ERROR_GETTING_ORDERS,
      );
    }
  }

  async changeOrderStatus(
    id: string,
    { statusId, comment }: ChangeOrderStatusDto,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const order = await this.findOne({ where: { id } }).catch((error) => {
      throw new ConflictException(error.originalError);
    });
    const status = await this.orderStatusRespository
      .findOne({
        where: { id: statusId },
      })
      .catch((error) => {
        throw new ConflictException(error.originalError);
      });

    if (
      status.status === OrderStatusEnum.CANCELED &&
      (!comment || comment.length === 0)
    ) {
      throw new ConflictException(orderErrorsConst.ERROR_EMPTY_COMMENT);
    }

    const orderComment = this.createOrderComment(comment, user);

    orderComment.order = order;
    order.status = status;

    try {
      await this.orderCommentRepository.save(orderComment);
      return await this.save(order);
    } catch (error) {
      throw error;
    }
  }

  async assignDeliveryMan({
    orderId,
    userId,
  }: AssignDeliveryManDto): Promise<void> {
    try {
      const order = await this.findOne({ where: { id: orderId } });

      if (!order) {
        throw new NotFoundException(orderErrorsConst.ERROR_ORDER_NOT_FOUND);
      }

      const deliveryUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!deliveryUser) {
        throw new NotFoundException(userErrorsConst.ERROR_USER_NOT_FOUND);
      }

      order.deliveryUser = deliveryUser;
      await this.save(order);
    } catch (error) {
      if (error.status && error.status === 404) {
        throw error;
      } else {
        throw new ConflictException(error.driverError);
      }
    }
  }

  private processDetails(products: ItemCartDto[]): OrderDetailEntity[] {
    const details = [];

    products.map(async (product) => {
      details.push(
        this.orderDetailRepository.create({
          price: product.price,
          salePrice: product.price,
          quantity: product.total,
          product: this.productRepository.create(product),
        }),
      );
    });
    return details;
  }

  async getOrderStatus(status: OrderStatusEnum): Promise<OrderStatusEntity> {
    return await this.orderStatusRespository.findOne({
      where: { status },
    });
  }

  async getAddress(id: string): Promise<AddressEntity> {
    const address = await this.addressRepository.findOne({ where: { id } });

    // if (!address) {
    //   throw new NotFoundException(addressErrorsConst.ERROR_ADDRESS_NOT_FOUND);
    // }

    return address;
  }

  createOrderComment(note: string, user): OrderCommentEntity {
    return this.orderCommentRepository.create({
      note,
      user,
    });
  }
}
