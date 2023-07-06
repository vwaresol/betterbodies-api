import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderCommentEntity } from './order-comment.entity';

@Injectable()
export class OrderCommentRepository extends Repository<OrderCommentEntity> {
  constructor(dataSource: DataSource) {
    super(OrderCommentEntity, dataSource.createEntityManager());
  }
}
