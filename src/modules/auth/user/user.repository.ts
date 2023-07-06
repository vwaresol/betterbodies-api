import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { columnsSort, userConst, userErrorsConst } from 'src/const/user.const';
import { RoleRepository } from '../role/role.repository';
import { UserProfileRepository } from 'src/modules/user-profile/user-profile.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { GetUserFilterDto } from 'src/dtos/user/get-user-filter.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UpdateCustomerDto } from 'src/dtos/user/update-customer.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    dataSource: DataSource,
    private roleRepository: RoleRepository,
    private userProfileRepository: UserProfileRepository,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(userData: SignupDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const roleName = userData.role ? userData.role : userConst.ROLE_CUSTOMER;
    const role = await this.roleRepository.findOne({
      where: { role: roleName },
    });
    if (!role)
      throw new NotFoundException(userErrorsConst.ERROR_ROLE_NOT_FOUND);

    const userProfile = await this.userProfileRepository.create(userData);

    const user = this.create({
      username: userData.username,
      password: hashedPassword,
      role: role,
      userProfile,
    });
    try {
      await this.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505' || error.message.includes('UNIQUE KEY')) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findForUsername(username): Promise<UserEntity | null> {
    return this.findOne({
      where: { username },
      relations: ['userProfile'],
    });
  }

  async getUsers(
    { status, role, search, column, sort }: GetUserFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    const query = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.userProfile', 'userProfile')
      .innerJoinAndSelect('user.role', 'role')
      .where({});

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    if (role) {
      query.andWhere('role.role = :role', { role });
    }

    if (search) {
      query.andWhere(
        '(LOWER(user.username) LIKE LOWER(:search) OR LOWER(userProfile.name) LIKE LOWER(:search) OR LOWER(userProfileinfo.last_name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (column && sort) {
      query.orderBy(columnsSort[column], sort);
    }

    try {
      return await paginate(query, paginationOpts);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        userErrorsConst.ERROR_CREATING_USER,
      );
    }
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne({
      where: { id },
      relations: ['role', 'userProfile'],
    }).catch((error) => {
      throw new ConflictException(error.originalError);
    });

    if (!user) {
      throw new NotFoundException(userErrorsConst.ERROR_USER_NOT_FOUND);
    }

    const { role } = await this.roleRepository.findOne({
      where: { id: user.role.id },
    });

    if (role === userConst.ROLE_CUSTOMER) {
      throw new ConflictException(userErrorsConst.ERROR_CUSTOMER_UPDATE);
    }

    const userProfile = await this.userProfileRepository.findOne({
      where: { id: user.userProfile.id },
    });

    userProfile.name = userDto.name;
    userProfile.lastName = userDto.lastName;
    userProfile.motherLastName = userDto.motherLastName;

    if (userDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.password, salt);
      user.password = hashedPassword;
    }

    user.userProfile = userProfile;
    user.status = userDto.status;

    try {
      await this.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(userErrorsConst.ERROR_USER_UPDATE);
    }
  }

  async updateCustomer(
    user: UserEntity,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<UserEntity> {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id: user.userProfile.id },
    });
    userProfile.name = updateCustomerDto.name;
    userProfile.lastName = updateCustomerDto.lastName;
    userProfile.motherLastName = updateCustomerDto.motherLastName;

    user.userProfile = userProfile;

    try {
      await this.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        userErrorsConst.ERROR_CUSTOMER_UPDATE,
      );
    }
  }

  async changePassword(
    { id }: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.findOne({ where: { id } });
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.password, salt);
    user.password = hashedPassword;
    this.save(user);
  }

  async setPassword(user: UserEntity, password: string) {
    const hashedPassword = await this.generatePasswordHashed(password);
    user.password = hashedPassword;
    return this.save(user);
  }

  private async generatePasswordHashed(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
