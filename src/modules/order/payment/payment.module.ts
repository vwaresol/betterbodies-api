import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PaymentEntity } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { UserProfileEntity } from 'src/modules/user-profile/user-profile.entity';
import { AddressEntity } from 'src/modules/user-profile/address/address.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), AuthModule, HttpModule],
  providers: [
    PaymentService,
    PaymentRepository,
    UserProfileEntity,
    AddressEntity,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
