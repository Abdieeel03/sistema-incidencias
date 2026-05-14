import type { IncidentStatus } from './common.types';

// ========== Request DTOs ==========
export interface CreateIncidentRequest {
  title: string;
  description: string;
  studentId: number;
  classId: number;
  teacherId: number;
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
