import api from './axios';
import { SchoolClassResponse, CreateClassRequest, UpdateSchoolClassRequest, AddStudentsRequest } from '../types/class.types';
import { StudentResponse } from '../types/student.types';
import { ApiResponse } from '../types/api.types';

export const classesApi = {
  getClasses: async (): Promise<ApiResponse<SchoolClassResponse[]>> => {
    const response = await api.get<ApiResponse<SchoolClassResponse[]>>('/classes');
    return response.data;
  },

  getClassById: async (id: number): Promise<ApiResponse<SchoolClassResponse>> => {
    const response = await api.get<ApiResponse<SchoolClassResponse>>(`/classes/${id}`);
    return response.data;
  },

  getMyClasses: async (): Promise<ApiResponse<SchoolClassResponse[]>> => {
    const response = await api.get<ApiResponse<SchoolClassResponse[]>>('/classes/my-classes');
    return response.data;
  },

  getDeletedClasses: async (): Promise<ApiResponse<SchoolClassResponse[]>> => {
    const response = await api.get<ApiResponse<SchoolClassResponse[]>>('/classes/deleted');
    return response.data;
  },

  getStudentsByClass: async (id: number): Promise<ApiResponse<StudentResponse[]>> => {
    const response = await api.get<ApiResponse<StudentResponse[]>>(`/classes/${id}/students`);
    return response.data;
  },

  createClass: async (data: CreateClassRequest): Promise<ApiResponse<SchoolClassResponse>> => {
    const response = await api.post<ApiResponse<SchoolClassResponse>>('/classes', data);
    return response.data;
  },

  updateClass: async (id: number, data: UpdateSchoolClassRequest): Promise<ApiResponse<SchoolClassResponse>> => {
    const response = await api.put<ApiResponse<SchoolClassResponse>>(`/classes/${id}`, data);
    return response.data;
  },

  addStudentsToClass: async (id: number, data: AddStudentsRequest): Promise<ApiResponse<SchoolClassResponse>> => {
    const response = await api.put<ApiResponse<SchoolClassResponse>>(`/classes/${id}/students`, data);
    return response.data;
  },

  deleteClass: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/classes/${id}`);
    return response.data;
  },

  restoreClass: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(`/classes/restore/${id}`);
    return response.data;
  },
};
