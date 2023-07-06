import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { ProductEntity } from 'src/modules/product/product.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from '../order.entity';

@Entity({ name: 'order_detail' })
export class OrderDetailEntity extends AbstractEntity {
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

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderDetails)
  product: ProductEntity;
}
