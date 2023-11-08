import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { addressErrorsConst } from 'src/const/address.const';
import { CreateAddressDto } from 'src/dtos/address/create-address.dto';
import { DataSource, Repository } from 'typeorm';
import { UserProfileEntity } from '../user-profile.entity';
import { UserProfileRepository } from '../user-profile.repository';
import { AddressEntity } from './address.entity';

@Injectable()
export class AddressRepository extends Repository<AddressEntity> {
  constructor(
    dataSource: DataSource,
    private userProfileRepository: UserProfileRepository,
  ) {
    super(AddressEntity, dataSource.createEntityManager());
  }

  async createAddress(
    userProfileId: string,
    addressData: CreateAddressDto,
  ): Promise<AddressEntity[]> {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id: userProfileId },
    });
    const address = this.create({
      ...addressData,
      userProfile,
    });

    if (address.main) await this.removeMain(userProfile);

    if (address.billingAddress) await this.removeBillingAddress(userProfile);

    try {
      await this.save(address);
      return await this.find({ where: { userProfile: { id: userProfileId } } });
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(
          addressErrorsConst.ERROR_ADDRESS_DUPLICATED,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteAddress(userProfileId: string, addressId: string): Promise<void> {
    try {
      await this.findOneOrFail({
        where: { userProfile: { id: userProfileId }, id: addressId },
      });
      this.softDelete(addressId);
    } catch (error) {
      throw new NotFoundException(addressErrorsConst.ERROR_ADDRESS_NOT_FOUND);
    }
  }

  private async removeMain(userProfile: UserProfileEntity): Promise<void> {
    await this.update({ userProfile }, { main: false });
  }

  private async removeBillingAddress(
    userProfile: UserProfileEntity,
  ): Promise<void> {
    await this.update({ userProfile }, { billingAddress: false });
  }
}
