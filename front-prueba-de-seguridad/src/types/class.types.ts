// ========== Request DTOs ==========
export interface CreateSchoolClassRequest {
  name: string;
  teacherId: number;
  studentIds?: number[];
}

export interface UpdateSchoolClassRequest {
  name: string;
  teacherId: number;
  studentIds?: number[];
}

// ========== Response DTOs ==========
export interface ClassStudentInfo {
  id: number;
  fullName: string;
  studentCode: string;
}

export interface SchoolClassResponse {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students: ClassStudentInfo[];
}
