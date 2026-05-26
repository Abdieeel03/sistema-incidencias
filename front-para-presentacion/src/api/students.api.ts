import api from './axios';
import { StudentResponse, StudentDetailResponse, CreateStudentRequest, UpdateStudentRequest } from '../types/student.types';
import { ApiResponse } from '../types/api.types';

export const studentsApi = {
  getStudents: async (): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>('/students');
    return response.data;
  },

  getMyChildren: async (): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>('/students/my-children');
    return response.data;
  },

  getStudentById: async (id: number): Promise<ApiResponse<StudentResponse>> => {
    const response = await api.get<ApiResponse<StudentResponse>>(`/students/${id}`);
    return response.data;
  },

  getStudentDetails: async (id: number): Promise<ApiResponse<StudentDetailResponse>> => {
    const response = await api.get<ApiResponse<StudentDetailResponse>>(`/students/${id}/details`);
    return response.data;
  },

  getStudentsByParent: async (parentId: number): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>(`/students/parent/${parentId}`);
    return response.data;
  },

  searchStudents: async (query: string): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>('/students/search', { params: { query } });
    return response.data;
  },

  getDeletedStudents: async (): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>('/students/deleted');
    return response.data;
  },

  createStudent: async (data: CreateStudentRequest): Promise<ApiResponse<StudentResponse>> => {
    const response = await api.post<ApiResponse<StudentResponse>>('/students', data);
    return response.data;
  },

  updateStudent: async (id: number, data: UpdateStudentRequest): Promise<ApiResponse<StudentResponse>> => {
    const response = await api.put<ApiResponse<StudentResponse>>(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/students/${id}`);
    return response.data;
  },

  restoreStudent: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>(`/students/${id}/restore`);
    return response.data;
  },
};
