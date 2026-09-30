import React from 'react';
import { useLogin } from '../../modules/auth/hooks/useLogin';
import { LoginUI } from '../../modules/auth/ui/LoginUI';
import { User } from '../../types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onForgotPassword,
}) => {
  const { login, loading, error } = useLogin();

  const handleLogin = async (email: string) => {
    const user = await login(email);
    if (user) {
      onSuccess(user);
    }
  };

  return (
    <LoginUI
      onSubmit={handleLogin}
      onSwitchToRegister={onNavigateToRegister}
      onForgotPassword={onForgotPassword}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;
