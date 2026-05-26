export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  studentCode: string;
  parentId?: number;
  parentName?: string;
  isDeleted?: boolean;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dni: string;
  parentId: number;
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  dni?: string;
  parentId: number;
}

export interface StudentSummary {
  id: number;
  fullName: string;
  studentCode: string;
}

export interface ClassSummary {
  id: number;
  name: string;
  teacher_name?: string;
}

export interface IncidentSummary {
  id: number;
  title: string;
  schoolClass_name?: string;
  status: string;
}

export interface StudentDetailResponse {
  id: number;
  fullName: string;
  studentCode: string;
  classes: ClassSummary[];
  incidents: IncidentSummary[];
}
