import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'reset-password' })
export class ResetPasswordEntity extends AbstractEntity {
  @Column({ length: '6' })
  token: string;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => UserEntity, (user) => user.resets)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
