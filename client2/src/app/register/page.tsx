import React from 'react';
import { useRegister } from '../../modules/auth/hooks/useRegister';
import { RegisterUI } from '../../modules/auth/ui/RegisterUI';
import { RegisterCredentials } from '../../modules/auth/types/auth.types';
import { User } from '../../types';

interface RegisterPageProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const { register, loading, error } = useRegister();

  const handleRegister = async (data: RegisterCredentials) => {
    const user = await register(data);
    if (user) {
      onSuccess(user);
    }
  };

  return (
    <RegisterUI
      onSubmit={handleRegister}
      onSwitchToLogin={onNavigateToLogin}
      loading={loading}
      error={error}
    />
  );
};

export default RegisterPage;
