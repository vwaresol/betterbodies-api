import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDto } from 'src/dtos/address/create-address.dto';
import { AddressServiceInterface } from 'src/interfaces/address/address-service.interface';
import { AddressEntity } from './address.entity';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService implements AddressServiceInterface {
  constructor(
    @InjectRepository(AddressRepository)
    private addressRepository: AddressRepository,
  ) {}

  async getAddresses(userProfileId: string): Promise<AddressEntity[]> {
    return await this.addressRepository.find({
      where: { userProfile: { id: userProfileId } },
    });
  }

  async createAddress(
    userProfileId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressEntity[]> {
    return await this.addressRepository.createAddress(
      userProfileId,
      createAddressDto,
    );
  }

  async deleteAddress(userProfileId: string, addressId: string): Promise<void> {
    return await this.addressRepository.deleteAddress(userProfileId, addressId);
  }
}
