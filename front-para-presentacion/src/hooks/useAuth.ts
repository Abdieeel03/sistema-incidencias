import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { token, user, isAuthenticated, role, logout, checkTokenExpiry } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const isValid = checkTokenExpiry();
      if (!isValid) {
        logout();
      }
    }
  }, [isAuthenticated, checkTokenExpiry, logout]);

  return {
    token,
    user,
    isAuthenticated,
    role,
    logout,
    checkTokenExpiry,
  };
};
