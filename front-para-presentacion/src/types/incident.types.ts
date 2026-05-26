export enum IncidentStatus {
  NO_LEIDA = 'NO_LEIDA',
  LEIDA = 'LEIDA',
}

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
  isDeleted?: boolean;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  studentId: number;
  classId: number;
}

export interface UpdateIncidentRequest {
  title?: string;
  description: string;
  studentId: number;
  classId: number;
}
