import { Role } from './auth.types';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: Role;
  createdById?: number;
  createdByUsername?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  dni: string;
  password: string;
  role: Role;
}

// Backend UpdateUserRequest solo acepta email
export interface UpdateUserRequest {
  email: string;
}

// Para actualización por coordinador: PUT /api/users/coordinator/{id}
export interface CoordinatorUpdateUserRequest {
  dni?: string;
  role: Role;
}
