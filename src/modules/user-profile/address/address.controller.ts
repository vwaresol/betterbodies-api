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
import { CreateAddressDto } from 'src/dtos/address/create-address.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { AddressEntity } from './address.entity';
import { AddressService } from './address.service';

@UseGuards(JwtAuthGuard)
@Controller('user-profile/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  getAddresses(
    @GetUser() { userProfile }: UserEntity,
  ): Promise<AddressEntity[]> {
    return this.addressService.getAddresses(userProfile.id);
  }

  @Post('create')
  async createAddress(
    @GetUser() { userProfile }: UserEntity,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressEntity[]> {
    return await this.addressService.createAddress(
      userProfile.id,
      createAddressDto,
    );
  }

  @Delete(':id/delete')
  async deleteAddress(
    @GetUser() { userProfile }: UserEntity,
    @Param('id') addressId,
  ): Promise<void> {
    await this.addressService.deleteAddress(userProfile.id, addressId);
  }
}
