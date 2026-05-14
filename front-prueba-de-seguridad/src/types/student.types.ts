import type { IncidentStatus } from './common.types';

// ========== Request DTOs ==========
export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dni: string;
  parentId: number;
}

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  dni: string;
  parentId: number;
}

// ========== Response DTOs ==========
export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  studentCode: string;
  parentId: number;
  parentName: string;
}

export interface StudentClassInfo {
  id: number;
  name: string;
  teacher_name: string;
}

export interface StudentIncidentInfo {
  id: number;
  title: string;
  schoolClass_name: string;
  status: IncidentStatus;
}

export interface StudentDetailResponse {
  id: number;
  fullName: string;
  studentCode: string;
  classes: StudentClassInfo[];
  incidents: StudentIncidentInfo[];
}
