import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { phoneErrorConst } from 'src/const/phone.const';
import { CreatePhoneDto } from 'src/dtos/phone/create-phone.dto';
import { DataSource, Repository } from 'typeorm';
import { UserProfileEntity } from '../user-profile.entity';
import { UserProfileRepository } from '../user-profile.repository';
import { PhoneEntity } from './phone.entity';

@Injectable()
export class PhoneRepository extends Repository<PhoneEntity> {
  constructor(
    dataSource: DataSource,
    private userProfileRepository: UserProfileRepository,
  ) {
    super(PhoneEntity, dataSource.createEntityManager());
  }

  async createPhone(
    userProfileId: string,
    phoneData: CreatePhoneDto,
  ): Promise<PhoneEntity[]> {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id: userProfileId },
    });

    const phone = this.create({
      ...phoneData,
      userProfile,
    });

    if (phone.main) await this.removeMain(userProfile);

    try {
      await this.save(phone);
      return await this.find({where: {userProfile:{id:userProfileId}}});
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(phoneErrorConst.ERROR_PHONE_DUPLICATED);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deletePhone(userProfileId: string, phoneId: string): Promise<void> {
    try {
      await this.findOneOrFail({
        where: { userProfile: { id: userProfileId }, id: phoneId },
      });
      this.softDelete(phoneId);
    } catch (error) {
      throw new NotFoundException(phoneErrorConst.ERROR_PHONE_NOT_FOUND);
    }
  }

  private async removeMain(userProfile: UserProfileEntity): Promise<void> {
    await this.update({ userProfile: userProfile }, { main: false });
  }
}
