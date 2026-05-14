import { publicFetch } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

export const authService = {
  login(data: LoginRequest) {
    return publicFetch<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register(data: RegisterRequest) {
    return publicFetch<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  },
};
