import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../auth/user/user.entity';
import { UserProfileService } from './user-profile.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get()
  getInfo(@GetUser() { userProfile }: UserEntity): Promise<any> {
    return this.userProfileService.getProfile(userProfile.id);
  }
}
