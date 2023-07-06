import { UserProfileEntity } from 'src/modules/user-profile/user-profile.entity';

export interface UserProfileServiceInterface {
  getProfile(userInfoId: string): Promise<UserProfileEntity>;
}
