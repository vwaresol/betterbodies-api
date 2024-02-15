import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePhoneDto } from 'src/dtos/phone/create-phone.dto';
import { PhoneEntity } from './phone.entity';
import { PhoneRepository } from './phone.repository';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(PhoneRepository)
    private phoneRepository: PhoneRepository,
  ) {}

  async getPhones(userProfileId: string): Promise<PhoneEntity[]> {
    return await this.phoneRepository.find({
      where: { userProfile: { id: userProfileId } },
    });
  }

  async getPhone(id: string): Promise<PhoneEntity | undefined> {
    return await this.phoneRepository.findOne({ where: { id } });
  }

  async createPhone(
    userProfileId: string,
    createPhoneDto: CreatePhoneDto,
  ): Promise<PhoneEntity[]> {
    return await this.phoneRepository.createPhone(
      userProfileId,
      createPhoneDto,
    );
  }

  async deletePhone(userProfileId: string, phoneId: string): Promise<void> {
    return await this.phoneRepository.deletePhone(userProfileId, phoneId);
  }
}
