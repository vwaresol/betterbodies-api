import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserProfileEntity } from '../user-profile.entity';

@Entity({ name: 'phone' })
export class PhoneEntity extends AbstractEntity {
  @Column({
    length: 2,
    nullable: true,
  })
  code: string;

  @Column({ length: 12, nullable: true })
  phone: string;

  @Column({ default: true })
  main: boolean;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.phone)
  @JoinColumn()
  userProfile: UserProfileEntity;
}
