import { authFetch } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
  CreateIncidentRequest,
  UpdateIncidentRequest,
  IncidentResponse,
} from '../types/incident.types';

export const incidentService = {
  /** GET /api/incidents — ADMIN, COORDINADOR */
  getAll() {
    return authFetch<IncidentResponse[]>(ENDPOINTS.INCIDENTS.BASE);
  },

  /** GET /api/incidents/{id} — Autenticado con acceso */
  getById(id: number) {
    return authFetch<IncidentResponse>(ENDPOINTS.INCIDENTS.BY_ID(id));
  },

  /** GET /api/incidents/deleted — COORDINADOR, PROFESOR */
  getDeleted() {
    return authFetch<IncidentResponse[]>(ENDPOINTS.INCIDENTS.DELETED);
  },

  /** GET /api/incidents/my-incidents — Solo PROFESOR */
  getMyIncidents() {
    return authFetch<IncidentResponse[]>(ENDPOINTS.INCIDENTS.MY_INCIDENTS);
  },

  /** GET /api/incidents/student/{studentId} — Autenticado con acceso */
  getByStudent(studentId: number) {
    return authFetch<IncidentResponse[]>(ENDPOINTS.INCIDENTS.BY_STUDENT(studentId));
  },

  /** GET /api/incidents/class/{classId} — ADMIN, COORDINADOR, PROFESOR */
  getByClass(classId: number) {
    return authFetch<IncidentResponse[]>(ENDPOINTS.INCIDENTS.BY_CLASS(classId));
  },

  /** POST /api/incidents — Solo PROFESOR (teacherId se extrae del JWT) */
  create(data: CreateIncidentRequest) {
    return authFetch<IncidentResponse>(ENDPOINTS.INCIDENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PUT /api/incidents/{id} — Solo PROFESOR */
  update(id: number, data: UpdateIncidentRequest) {
    return authFetch<IncidentResponse>(ENDPOINTS.INCIDENTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /api/incidents/{id}/read — Solo PADRE */
  markAsRead(id: number) {
    return authFetch<IncidentResponse>(ENDPOINTS.INCIDENTS.MARK_READ(id), {
      method: 'PATCH',
    });
  },

  /** DELETE /api/incidents/{id} — Solo PROFESOR */
  delete(id: number) {
    return authFetch<void>(ENDPOINTS.INCIDENTS.BY_ID(id), {
      method: 'DELETE',
    });
  },

  /** PUT /api/incidents/restore/{id} — PROFESOR */
  restore(id: number) {
    return authFetch<IncidentResponse>(ENDPOINTS.INCIDENTS.RESTORE(id), {
      method: 'PUT',
    });
  },
};
