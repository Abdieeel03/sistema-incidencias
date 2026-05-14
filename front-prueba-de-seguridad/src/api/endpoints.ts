const API_BASE = 'http://localhost:8080/api';

export const ENDPOINTS = {
  // Auth — Público
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
  },

  // Users — Requiere token
  USERS: {
    BASE: `${API_BASE}/users`,
    BY_ID: (id: number) => `${API_BASE}/users/${id}`,
    DELETED: `${API_BASE}/users/deleted`,
    RESTORE: (id: number) => `${API_BASE}/users/${id}/restore`,
    CHANGE_PASSWORD: `${API_BASE}/users/me/change-password`,
  },

  // Students — Requiere token
  STUDENTS: {
    BASE: `${API_BASE}/students`,
    BY_ID: (id: number) => `${API_BASE}/students/${id}`,
    DETAILS: (id: number) => `${API_BASE}/students/${id}/details`,
    DELETED: `${API_BASE}/students/deleted`,
    SEARCH: (query: string) => `${API_BASE}/students/search?query=${encodeURIComponent(query)}`,
    BY_PARENT: (parentId: number) => `${API_BASE}/students/parent/${parentId}`,
    MY_CHILDREN: `${API_BASE}/students/my-children`,
    RESTORE: (id: number) => `${API_BASE}/students/${id}/restore`,
  },

  // Classes — Requiere token
  CLASSES: {
    BASE: `${API_BASE}/classes`,
    BY_ID: (id: number) => `${API_BASE}/classes/${id}`,
    DELETED: `${API_BASE}/classes/deleted`,
    MY_CLASSES: `${API_BASE}/classes/my-classes`,
    STUDENTS: (id: number) => `${API_BASE}/classes/${id}/students`,
    RESTORE: (id: number) => `${API_BASE}/classes/restore/${id}`,
  },
} as const;
