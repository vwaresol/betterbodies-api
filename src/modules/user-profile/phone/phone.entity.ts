import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserProfileEntity } from '../user-profile.entity';

@Entity({ name: 'phone' })
export class PhoneEntity extends AbstractEntity {
  @Column({ length: 12 })
  phone: string;

  @Column({ default: true })
  main: boolean;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.phone)
  @JoinColumn()
  userProfile: UserProfileEntity;
}
