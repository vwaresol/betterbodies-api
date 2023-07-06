import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserFilterDto } from 'src/dtos/user/get-user-filter.dto';
import { UserService } from './user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserEntity } from './user.entity';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UpdateCustomerDto } from 'src/dtos/user/update-customer.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('/')
  getUsers(
    @Query() userFilterDto: GetUserFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<UserEntity>> {
    limit = limit > 50 ? 50 : limit;
    return this.userService.getUsers(userFilterDto, {
      page,
      limit,
      route: this.configService.get('HOST'),
    });
  }

  @Get('/delivery-men')
  getDeliveryMen(): Promise<UserEntity[]> {
    return this.userService.getDeliveryMen();
  }

  @Get('/:id')
  getUserByid(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Post('/create')
  createUser(@Body() signupDto: SignupDto): Promise<UserEntity> {
    return this.userService.createUser(signupDto);
  }

  @Put('/')
  updateCustomer(
    @GetUser() user: UserEntity,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<UserEntity> {
    return this.userService.updateCustomer(user, updateCustomerDto);
  }

  @Put('/:id/update')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id/delete')
  @HttpCode(204)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch('/change-password')
  @HttpCode(204)
  changePassword(
    @GetUser() user: UserEntity,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.userService.changePassword(user, changePasswordDto);
  }
}
