import { StudentSummary } from './student.types';

export interface SchoolClassResponse {
  id: number;
  name: string;
  teacherId?: number;
  teacherName?: string;
  students: StudentSummary[];
  isDeleted?: boolean;
}

export interface CreateClassRequest {
  name: string;
  teacherId: number;
  studentIds?: number[];
}

export interface UpdateSchoolClassRequest {
  name?: string;
  teacherId: number;
  studentIds?: number[];
}

export interface AddStudentsRequest {
  studentIds: number[];
}
