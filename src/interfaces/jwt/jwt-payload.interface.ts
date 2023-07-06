export interface JwtPayload {
  username: string; // Email
  userId: string; // UserId
  userInfoId: string; // UserInfoId
  role: string;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}
