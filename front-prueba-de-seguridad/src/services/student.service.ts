import { authFetch } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentResponse,
  StudentDetailResponse,
} from '../types/student.types';

export const studentService = {
  getAll() {
    return authFetch<StudentResponse[]>(ENDPOINTS.STUDENTS.BASE);
  },

  getById(id: number) {
    return authFetch<StudentResponse>(ENDPOINTS.STUDENTS.BY_ID(id));
  },

  getDetails(id: number) {
    return authFetch<StudentDetailResponse>(ENDPOINTS.STUDENTS.DETAILS(id));
  },

  getDeleted() {
    return authFetch<StudentResponse[]>(ENDPOINTS.STUDENTS.DELETED);
  },

  search(query: string) {
    return authFetch<StudentResponse[]>(ENDPOINTS.STUDENTS.SEARCH(query));
  },

  getByParent(parentId: number) {
    return authFetch<StudentResponse[]>(ENDPOINTS.STUDENTS.BY_PARENT(parentId));
  },

  getMyChildren() {
    return authFetch<StudentResponse[]>(ENDPOINTS.STUDENTS.MY_CHILDREN);
  },

  create(data: CreateStudentRequest) {
    return authFetch<StudentResponse>(ENDPOINTS.STUDENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: UpdateStudentRequest) {
    return authFetch<StudentResponse>(ENDPOINTS.STUDENTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return authFetch<void>(ENDPOINTS.STUDENTS.BY_ID(id), {
      method: 'DELETE',
    });
  },

  restore(id: number) {
    return authFetch<StudentResponse>(ENDPOINTS.STUDENTS.RESTORE(id), {
      method: 'PATCH',
    });
  },
};
