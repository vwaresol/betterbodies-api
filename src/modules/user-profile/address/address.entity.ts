import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { OrderEntity } from 'src/modules/order/order.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../user-profile.entity';

@Entity({ name: 'address' })
export class AddressEntity extends AbstractEntity {
  @Column({
    nullable: true,
  })
  receipter: string;

  @Column()
  street: string;

  @Column({ length: 10, nullable: true })
  intNumber: string;

  @Column({ length: 10 })
  extNumber: string;

  @Column({ length: 100 })
  suburb: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 5 })
  zipCode: string;

  @Column({ default: true })
  main: boolean;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.address)
  @JoinColumn()
  userProfile: UserProfileEntity;

  @OneToMany(() => OrderEntity, (order) => order.address)
  @JoinColumn({ name: 'delivery_address_id' })
  orders: OrderEntity[];
}
