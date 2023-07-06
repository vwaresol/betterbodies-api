import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // This column helps us to expire all the refresh tokens when we want.
  isRevoked: boolean;

  @Column()
  expires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
