import type { IncidentStatus } from './common.types';

// ========== Request DTOs ==========

/**
 * Crear incidencia — Solo PROFESOR.
 * NOTA: teacherId NO se envía, se extrae automáticamente del JWT del profesor autenticado.
 */
export interface CreateIncidentRequest {
  title: string;
  description: string;
  studentId: number;
  classId: number;
}

export interface UpdateIncidentRequest {
  title: string;
  description: string;
  studentId: number;
  classId: number;
}

// ========== Response DTOs ==========
export interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  incidentDate: string;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
}
