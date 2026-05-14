// ========== Respuesta genérica de la API ==========
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ========== Respuesta de error ==========
export interface ErrorResponse {
  message: string;
  error: string;
  status: number;
  path: string;
  method: string;
  timestamp: string;
}

// ========== Roles ==========
export const Role = {
  ADMIN: 'ADMIN',
  COORDINADOR: 'COORDINADOR',
  PROFESOR: 'PROFESOR',
  PADRE: 'PADRE',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// ========== Estado de Incidencia ==========
export const IncidentStatus = {
  NO_LEIDA: 'NO_LEIDA',
  LEIDA: 'LEIDA',
} as const;

export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];
