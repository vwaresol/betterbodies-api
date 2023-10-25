import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { OrderDetailEntity } from '../order/order-detail/order-detail.entity';
import { PhotoEntity } from '../photo/photo.entity';
import { CategoryEntity } from './category/category.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  sku: string;

  @Column({ length: 50, nullable: true })
  barcode: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  salePrice: number;

  @Column({ width: 5 })
  quantity: number;

  @Column({ default: 1 })
  isActive: boolean;

  @ManyToMany(() => CategoryEntity, (category) => category.id, {
    cascade: true,
  })
  @JoinTable()
  categories: CategoryEntity[];

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => PhotoEntity, (photo) => photo.product)
  photos: PhotoEntity[];
}
