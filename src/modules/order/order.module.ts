import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderStatusRepository } from './order-status/order-status.repository';
import { ProductService } from '../product/product.service';
import { AddressRepository } from '../user-profile/address/address.repository';
import { OrderCommentRepository } from './order-comment/order-comment.repository';
import { UserRepository } from '../auth/user/user.repository';
import { OrderDetailRepository } from './order-detail/order-detail.repository';
import { ProductRepository } from '../product/product.repository';
import { CategoryRepository } from '../product/category/cateogory.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { RoleRepository } from '../auth/role/role.repository';
import { PaymentService } from './payment/payment.service';
import { PaymentRepository } from './payment/payment.repository';
import { HttpModule } from '@nestjs/axios';
import { MailService } from 'src/providers/mail/mail.service';
import { PhoneService } from '../user-profile/phone/phone.service';
import { PhoneRepository } from '../user-profile/phone/phone.repository';
import { AddressService } from '../user-profile/address/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), AuthModule, HttpModule],
  providers: [
    OrderService,
    OrderRepository,
    OrderStatusRepository,
    ProductService,
    ProductRepository,
    CategoryRepository,
    AddressRepository,
    OrderCommentRepository,
    UserRepository,
    UserProfileRepository,
    RoleRepository,
    OrderDetailRepository,
    PaymentService,
    PaymentRepository,
    MailService,
    PhoneService,
    PhoneRepository,
    AddressService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
