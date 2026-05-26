export enum Role {
  ADMIN = 'ADMIN',
  COORDINADOR = 'COORDINADOR',
  PROFESOR = 'PROFESOR',
  PADRE = 'PADRE',
}

export interface UserSession {
  id: number;
  username: string;
  email: string;
  name: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  dni: string;
  password: string;
}

// Matches the backend AuthResponse DTO exactly
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  role: Role;
}
