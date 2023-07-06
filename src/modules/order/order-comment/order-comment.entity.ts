import { UserEntity } from 'src/modules/auth/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OrderEntity } from '../order.entity';

@Entity({ name: 'order_comment' })
export class OrderCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.comments)
  order: OrderEntity;

  @ManyToOne(() => UserEntity, (user) => user.OrderComments)
  user: UserEntity;
}
