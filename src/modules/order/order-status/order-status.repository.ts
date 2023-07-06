import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderStatusEntity } from './order-status.entity';

@Injectable()
export class OrderStatusRepository extends Repository<OrderStatusEntity> {
  constructor(dataSource: DataSource) {
    super(OrderStatusEntity, dataSource.createEntityManager());
  }
}
