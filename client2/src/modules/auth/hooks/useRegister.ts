import { useState } from 'react';
import { authService } from '../services/authService';
import { RegisterCredentials } from '../types/auth.types';
import { User } from '../../../types';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterCredentials): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.register(data);
      return user;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
