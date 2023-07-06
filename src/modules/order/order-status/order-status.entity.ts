import { Exclude } from 'class-transformer';
import { OrderStatusEnum } from 'src/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order.entity';

@Entity({ name: 'order_status' })
export class OrderStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.CREATED,
  })
  status: OrderStatusEnum;

  @OneToMany(() => OrderEntity, (order) => order.status)
  orders: OrderEntity[];

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;
}
