import { User } from '../../../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  department?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
