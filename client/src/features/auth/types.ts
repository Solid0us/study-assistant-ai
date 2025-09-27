export type LoginRequest = {
  username: string;
  password: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: TokenResponse;
  refreshToken: TokenResponse;
};

export type TokenResponse = {
  token: string;
  payload: {
    user_id: string;
    username: string;
    iat: Date;
    exp: Date;
  };
};

export type RefreshResponse = {
  token: string;
  payload: {
    user_id: string;
    username: string;
    iat: Date;
    exp: Date;
  };
};
