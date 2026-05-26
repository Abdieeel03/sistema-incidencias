import api from './axios';
import { IncidentResponse, CreateIncidentRequest, UpdateIncidentRequest } from '../types/incident.types';
import { ApiResponse } from '../types/api.types';

export const incidentsApi = {
  getIncidents: async (): Promise<ApiResponse<IncidentResponse[]>> => {
    const response = await api.get<ApiResponse<IncidentResponse[]>>('/incidents');
    return response.data;
  },

  getIncidentById: async (id: number): Promise<ApiResponse<IncidentResponse>> => {
    const response = await api.get<ApiResponse<IncidentResponse>>(`/incidents/${id}`);
    return response.data;
  },

  getMyIncidents: async (): Promise<ApiResponse<IncidentResponse[]>> => {
    const response = await api.get<ApiResponse<IncidentResponse[]>>('/incidents/my-incidents');
    return response.data;
  },

  getStudentIncidents: async (studentId: number): Promise<ApiResponse<IncidentResponse[]>> => {
    const response = await api.get<ApiResponse<IncidentResponse[]>>(`/incidents/student/${studentId}`);
    return response.data;
  },

  getClassIncidents: async (classId: number): Promise<ApiResponse<IncidentResponse[]>> => {
    const response = await api.get<ApiResponse<IncidentResponse[]>>(`/incidents/class/${classId}`);
    return response.data;
  },

  getDeletedIncidents: async (): Promise<ApiResponse<IncidentResponse[]>> => {
    const response = await api.get<ApiResponse<IncidentResponse[]>>('/incidents/deleted');
    return response.data;
  },

  createIncident: async (data: CreateIncidentRequest): Promise<ApiResponse<IncidentResponse>> => {
    const response = await api.post<ApiResponse<IncidentResponse>>('/incidents', data);
    return response.data;
  },

  updateIncident: async (id: number, data: UpdateIncidentRequest): Promise<ApiResponse<IncidentResponse>> => {
    const response = await api.put<ApiResponse<IncidentResponse>>(`/incidents/${id}`, data);
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>(`/incidents/${id}/read`);
    return response.data;
  },

  deleteIncident: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/incidents/${id}`);
    return response.data;
  },

  restoreIncident: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>(`/incidents/restore/${id}`);
    return response.data;
  },
};
