import { api } from '../../../services/api';
import { LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { User } from '../../../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const res = await api.login(credentials.email, credentials.password);
    return res.user;
  },

  async register(data: RegisterCredentials): Promise<User> {
    const res = await api.register({
      name: data.name,
      email: data.email,
      department: data.department,
      password: data.password,
    });
    return res.user;
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.getCurrentUser();
    return res.user;
  },
};
