import { CreateAddressDto } from 'src/dtos/address/create-address.dto';
import { AddressEntity } from 'src/modules/user-profile/address/address.entity';

export interface AddressServiceInterface {
  getAddresses(userProfileId: string): Promise<AddressEntity[]>;
  createAddress(
    userProfileId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressEntity[]>;
  deleteAddress(userProfileId: string, addressId: string): Promise<void>;
}
