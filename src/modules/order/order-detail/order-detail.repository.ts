import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderDetailEntity } from './order-detail.entity';

@Injectable()
export class OrderDetailRepository extends Repository<OrderDetailEntity> {
  constructor(dataSource: DataSource) {
    super(OrderDetailEntity, dataSource.createEntityManager());
  }
}
