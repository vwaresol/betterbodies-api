import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreatePhoneDto } from 'src/dtos/phone/create-phone.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { PhoneEntity } from './phone.entity';
import { PhoneService } from './phone.service';

@UseGuards(JwtAuthGuard)
@Controller('user-profile/phone')
export class PhoneController {
  constructor(private phoneService: PhoneService) {}

  @Get()
  getPhones(@GetUser() { userProfile }: UserEntity): Promise<PhoneEntity[]> {
    return this.phoneService.getPhones(userProfile.id);
  }

  @Post('/create')
  async createPhone(
    @GetUser() { userProfile }: UserEntity,
    @Body() createPhoneDto: CreatePhoneDto,
  ): Promise<PhoneEntity[]> {
    return await this.phoneService.createPhone(userProfile.id, createPhoneDto);
  }

  @Delete(':phoneId/delete')
  async deleteAddress(
    @GetUser() { userProfile }: UserEntity,
    @Param('phoneId') phoneId,
  ): Promise<void> {
    return await this.phoneService.deletePhone(userProfile.id, phoneId);
  }
}
