import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { PaymentMethodEnum } from 'src/enums/payment.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order.entity';

@Entity({ name: 'payment' })
export class PaymentEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referenceId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  textCode: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.AUTORIZENET,
  })
  paymentMethod: PaymentMethodEnum;

  @ManyToOne(() => OrderEntity, (order) => order.payments)
  order: OrderEntity;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;
}
