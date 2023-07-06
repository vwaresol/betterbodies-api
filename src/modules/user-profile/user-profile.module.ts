import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { UserProfileRepository } from './user-profile.repository';
import { UserProfileController } from './user-profile.controller';
import { AddressController } from './address/address.controller';
import { AddressEntity } from './address/address.entity';
import { AddressService } from './address/address.service';
import { AddressRepository } from './address/address.repository';
import { PhoneEntity } from './phone/phone.entity';
import { PhoneController } from './phone/phone.controller';
import { PhoneService } from './phone/phone.service';
import { PhoneRepository } from './phone/phone.repository';
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserProfileEntity, AddressEntity, PhoneEntity]),
  ],
  controllers: [UserProfileController, AddressController, PhoneController],
  providers: [
    UserProfileService,
    UserProfileRepository,
    AddressService,
    AddressRepository,
    PhoneService,
    PhoneRepository,
  ],
  exports: [UserProfileService],
})
export class UserProfileModule {}
