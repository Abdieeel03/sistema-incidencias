import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthResponse } from '../types/auth.types';
import type { Role } from '../types/common.types';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';
import type { ApiResponse } from '../types/common.types';
import { authService } from '../services/auth.service';

interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  email: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role') as Role | null,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    // Sincronizar estado con localStorage
    if (state.token) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('userId', String(state.userId));
      localStorage.setItem('username', state.username || '');
      localStorage.setItem('email', state.email || '');
      localStorage.setItem('role', state.role || '');
    }
  }, [state]);

  const saveAuthData = (data: AuthResponse) => {
    setState({
      token: data.accessToken,
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      isAuthenticated: true,
    });
  };

  const login = async (data: LoginRequest) => {
    const result = await authService.login(data);
    if (result.ok && result.data && 'success' in result.data && result.data.success) {
      const apiData = result.data as ApiResponse<AuthResponse>;
      saveAuthData(apiData.data);
      return { success: true, message: apiData.message };
    }
    const msg = result.error || (result.data && 'message' in result.data ? result.data.message : 'Error de autenticación');
    return { success: false, message: msg };
  };

  const register = async (data: RegisterRequest) => {
    const result = await authService.register(data);
    if (result.ok && result.data && 'success' in result.data && result.data.success) {
      const apiData = result.data as ApiResponse<AuthResponse>;
      saveAuthData(apiData.data);
      return { success: true, message: apiData.message };
    }
    const msg = result.error || (result.data && 'message' in result.data ? result.data.message : 'Error de registro');
    return { success: false, message: msg };
  };

  const logout = () => {
    authService.logout();
    setState({
      token: null,
      userId: null,
      username: null,
      email: null,
      role: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
