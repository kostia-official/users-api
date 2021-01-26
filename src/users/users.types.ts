import { User } from './users.entity';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: UserResult;
}

export type UserResult = Omit<User, 'password'>;
