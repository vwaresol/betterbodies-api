import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { GetUserFilterDto } from 'src/dtos/user/get-user-filter.dto';
import { UserEntity } from 'src/modules/auth/user/user.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UpdateCustomerDto } from 'src/dtos/user/update-customer.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';

export interface UserServiceInterface {
  getUsers(
    filters: GetUserFilterDto,
    paginateOpts: IPaginationOptions,
  ): Promise<Pagination<UserEntity>>;
  getUserById(userId: string): Promise<UserEntity>;
  createUser(
    user: SignupDto,
    stripeCustomerId?: string,
    isAdmin?: boolean,
  ): Promise<UserEntity>;
  updateUser(id: string, user: UpdateUserDto): Promise<UserEntity>;
  deleteUser(userId: string): Promise<void>;
  findForUsername(username: string): Promise<UserEntity | null>;
  setPassword(user: UserEntity, password: string): Promise<UserEntity>;
  updateCustomer(
    user: UserEntity,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<UserEntity>;
  changePassword(
    user: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;
  getDeliveryMen(): Promise<UserEntity[]>;
}
