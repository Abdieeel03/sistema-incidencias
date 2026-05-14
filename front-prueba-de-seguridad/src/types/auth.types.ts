import type { Role } from './common.types';

// ========== Request DTOs ==========
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  dni: string;
  password: string;
}

// ========== Response DTOs ==========
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  role: Role;
}
