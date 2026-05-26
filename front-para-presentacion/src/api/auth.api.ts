import api from './axios';
import { LoginRequest, RegisterRequest, AuthResponse, UserSession } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

/**
 * Transforms the flat AuthResponse from the backend into a UserSession object
 * that the frontend auth store can use.
 */
const toUserSession = (res: AuthResponse): UserSession => ({
  id: res.userId,
  username: res.username,
  email: res.email,
  name: res.username, // backend doesn't return a separate "name" field in auth response
  role: res.role,
});

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = response.data.data;
    return {
      ...response.data,
      parsed: authData
        ? { accessToken: authData.accessToken, user: toUserSession(authData) }
        : null,
    };
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = response.data.data;
    return {
      ...response.data,
      parsed: authData
        ? { accessToken: authData.accessToken, user: toUserSession(authData) }
        : null,
    };
  },

  // Backend ChangePasswordRequest: { currentPassword, newPassword, confirmPassword }
  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>('/users/me/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetCode: async (email: string, code: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/verify-reset-code', { email, code });
    return response.data;
  },

  resetPassword: async (email: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', { email, newPassword, confirmPassword });
    return response.data;
  },
};
