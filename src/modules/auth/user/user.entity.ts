import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { OrderCommentEntity } from 'src/modules/order/order-comment/order-comment.entity';
import { OrderEntity } from 'src/modules/order/order.entity';
import { UserProfileEntity } from 'src/modules/user-profile/user-profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { ResetPasswordEntity } from '../reset-password/reset-password.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, length: '100' })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn()
  userProfile: UserProfileEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn()
  role: RoleEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.deliveryUser)
  ordersToDeliver: OrderEntity[];

  @OneToMany(() => OrderCommentEntity, (comment) => comment.user)
  OrderComments: OrderCommentEntity[];

  @OneToMany(() => ResetPasswordEntity, (resets) => resets.user)
  resets: ResetPasswordEntity[];
}
