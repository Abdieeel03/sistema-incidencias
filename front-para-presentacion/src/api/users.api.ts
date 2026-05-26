import api from './axios';
import { UserResponse, CreateUserRequest, UpdateUserRequest, CoordinatorUpdateUserRequest } from '../types/user.types';
import { ApiResponse } from '../types/api.types';

export const usersApi = {
  getUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return response.data;
  },

  getTeachers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/teachers');
    return response.data;
  },

  getParents: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/parents');
    return response.data;
  },

  getParentByDni: async (dni: string): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/parents/dni/${dni}`);
    return response.data;
  },

  getDeletedUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/deleted');
    return response.data;
  },

  getDeletedTeachers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/teachers/deleted');
    return response.data;
  },

  getDeletedParents: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/parents/deleted');
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await api.post<ApiResponse<UserResponse>>('/users', data);
    return response.data;
  },

  // Self-update: PUT /api/users/me/update (solo email)
  updateMyProfile: async (data: UpdateUserRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await api.put<ApiResponse<UserResponse>>('/users/me/update', data);
    return response.data;
  },

  // Coordinator update: PUT /api/users/coordinator/{id} (dni, role)
  coordinatorUpdateUser: async (id: number, data: CoordinatorUpdateUserRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await api.put<ApiResponse<UserResponse>>(`/users/coordinator/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  restoreUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>(`/users/${id}/restore`);
    return response.data;
  },
};
