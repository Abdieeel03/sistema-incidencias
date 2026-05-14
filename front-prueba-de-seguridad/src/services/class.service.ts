import { authFetch } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
  CreateSchoolClassRequest,
  UpdateSchoolClassRequest,
  SchoolClassResponse,
} from '../types/class.types';
import type { StudentResponse } from '../types/student.types';

export const classService = {
  getAll() {
    return authFetch<SchoolClassResponse[]>(ENDPOINTS.CLASSES.BASE);
  },

  getById(id: number) {
    return authFetch<SchoolClassResponse>(ENDPOINTS.CLASSES.BY_ID(id));
  },

  getDeleted() {
    return authFetch<SchoolClassResponse[]>(ENDPOINTS.CLASSES.DELETED);
  },

  getMyClasses() {
    return authFetch<SchoolClassResponse[]>(ENDPOINTS.CLASSES.MY_CLASSES);
  },

  getStudents(id: number) {
    return authFetch<StudentResponse[]>(ENDPOINTS.CLASSES.STUDENTS(id));
  },

  create(data: CreateSchoolClassRequest) {
    return authFetch<SchoolClassResponse>(ENDPOINTS.CLASSES.BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: UpdateSchoolClassRequest) {
    return authFetch<SchoolClassResponse>(ENDPOINTS.CLASSES.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return authFetch<void>(ENDPOINTS.CLASSES.BY_ID(id), {
      method: 'DELETE',
    });
  },

  restore(id: number) {
    return authFetch<SchoolClassResponse>(ENDPOINTS.CLASSES.RESTORE(id), {
      method: 'PUT',
    });
  },
};
