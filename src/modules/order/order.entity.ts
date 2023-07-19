import { AbstractEntity } from 'src/common/entities/abstract-entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../auth/user/user.entity';
import { PaymentEntity } from './payment/payment.entity';
import { AddressEntity } from '../user-profile/address/address.entity';
import { OrderCommentEntity } from './order-comment/order-comment.entity';
import { OrderDetailEntity } from './order-detail/order-detail.entity';
import { OrderStatusEntity } from './order-status/order-status.entity';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import { PhoneEntity } from '../user-profile/phone/phone.entity';
@Entity({ name: 'order' })
export class OrderEntity extends AbstractEntity {
  @Generated('increment')
  @Column({ type: 'bigint' })
  orderNumber: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  shipping: number;

  @Column({ default: false })
  picked: boolean;

  @ManyToOne(() => OrderStatusEntity, (status) => status.orders)
  @JoinColumn()
  status: OrderStatusEntity;

  @ManyToOne(() => AddressEntity, (address) => address.orders, {
    cascade: true,
  })
  @JoinColumn()
  address: AddressEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders, { cascade: true })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => UserEntity, (deliveryMan) => deliveryMan.ordersToDeliver, {
    cascade: true,
  })
  @JoinColumn()
  deliveryUser: UserEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetailEntity[];
  @OneToMany(() => OrderCommentEntity, (orderComment) => orderComment.order, {
    cascade: true,
  })
  comments: OrderCommentEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order,{
    cascade: true
  })
  payments: PaymentEntity[];
  
}