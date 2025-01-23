export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends Tokens {
  userId: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

export interface UpdateUserVariables {
  userId: string;
  username: string;
  profilePictureFile?: File;
}
