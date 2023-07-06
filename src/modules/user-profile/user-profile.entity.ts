import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from '../auth/user/user.entity';
import { AddressEntity } from './address/address.entity';
import { PhoneEntity } from './phone/phone.entity';

@Entity({ name: 'user_profile' })
export class UserProfileEntity extends AbstractEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({
    length: 50,
    nullable: true,
  })
  motherLastName: string;

  @OneToMany(() => AddressEntity, (address) => address.userProfile)
  address: AddressEntity[];

  @OneToMany(() => PhoneEntity, (phone) => phone.userProfile)
  phone: PhoneEntity[];

  @OneToOne(() => UserEntity, (user) => user.userProfile)
  user: UserEntity;
}
