import { authFetch } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { CreateUserRequest, UpdateUserRequest, ChangePasswordRequest, UserResponse } from '../types/user.types';

export const userService = {
  getAll() {
    return authFetch<UserResponse[]>(ENDPOINTS.USERS.BASE);
  },

  getById(id: number) {
    return authFetch<UserResponse>(ENDPOINTS.USERS.BY_ID(id));
  },

  getDeleted() {
    return authFetch<UserResponse[]>(ENDPOINTS.USERS.DELETED);
  },

  create(data: CreateUserRequest) {
    return authFetch<UserResponse>(ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: UpdateUserRequest) {
    return authFetch<UserResponse>(ENDPOINTS.USERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return authFetch<void>(ENDPOINTS.USERS.BY_ID(id), {
      method: 'DELETE',
    });
  },

  restore(id: number) {
    return authFetch<UserResponse>(ENDPOINTS.USERS.RESTORE(id), {
      method: 'PATCH',
    });
  },

  changePassword(data: ChangePasswordRequest) {
    return authFetch<void>(ENDPOINTS.USERS.CHANGE_PASSWORD, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
