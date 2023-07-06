import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userErrorsConst } from 'src/const/user.const';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { GetUserFilterDto } from 'src/dtos/user/get-user-filter.dto';
import { UserServiceInterface } from 'src/interfaces/user/user-service.interface';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UpdateCustomerDto } from 'src/dtos/user/update-customer.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  getUsers(
    userFilterDto: GetUserFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    return this.userRepository.getUsers(userFilterDto, paginationOpts);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .findOne({
        where: { id },
        relations: ['role', 'userProfile'],
      })
      .catch((error) => {
        throw new ConflictException(error.message);
      });

    if (!user) {
      throw new NotFoundException(userErrorsConst.ERROR_USER_NOT_FOUND);
    }

    return user;
  }

  createUser(user: SignupDto): Promise<UserEntity> {
    return this.userRepository.createUser(user);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  updateCustomer(
    user: UserEntity,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<UserEntity> {
    return this.userRepository.updateCustomer(user, updateCustomerDto);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(userErrorsConst.ERROR_USER_NOT_FOUND);
    }

    await this.userRepository.softRemove(user);
  }

  changePassword(
    user: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.userRepository.changePassword(user, changePasswordDto);
  }

  findForId(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id: id.toString() } });
  }

  findForUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findForUsername(username);
  }

  setPassword(user: UserEntity, password: string): Promise<UserEntity> {
    return this.userRepository.setPassword(user, password);
  }

  async getDeliveryMen(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: { role: { role: 'Repartidor' } },
      relations: ['role'],
    });
  }
}
