export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
  profilePicture: string;
}
