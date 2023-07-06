import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'photo' })
export class PhotoEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  main: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.photos)
  @JoinColumn()
  product: ProductEntity[];
}
