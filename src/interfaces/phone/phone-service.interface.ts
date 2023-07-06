import { CreatePhoneDto } from 'src/dtos/phone/create-phone.dto';
import { PhoneEntity } from 'src/modules/user-profile/phone/phone.entity';

export interface PhoneServiceInterface {
  getPhones(userInfoId: string): Promise<PhoneEntity[]>;
  addPhone(
    userInfoId: string,
    createPhoneDto: CreatePhoneDto,
  ): Promise<PhoneEntity[]>;
  deletePhone(userInfoId: string, phoneId: string): Promise<void>;
}
