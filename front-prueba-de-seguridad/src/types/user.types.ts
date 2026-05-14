import type { Role } from './common.types';

// ========== Request DTOs ==========
export interface CreateUserRequest {
  email: string;
  name: string;
  dni: string;
  password: string;
  role: Role;
}

export interface UpdateUserRequest {
  email: string;
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Actualización especial por Coordinador.
 * Permite cambiar dni y role sin modificar nombre/email.
 */
export interface CoordinatorUpdateUserRequest {
  dni: string;
  role: Role;
}

// ========== Response DTOs ==========
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: Role;
  createdById: number;
  createdByUsername: string;
}
