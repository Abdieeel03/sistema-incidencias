import type { ApiResponse, ErrorResponse } from '../types/common.types';

/**
 * Resultado de una petición a la API.
 * Incluye metadata de la petición (status, duración) para mostrar en el ResponseViewer.
 */
export interface FetchResult<T> {
  ok: boolean;
  status: number;
  data: ApiResponse<T> | ErrorResponse | null;
  duration: number; // ms
  error?: string;   // Error de red / conexión
}

/**
 * Fetch wrapper con autenticación automática.
 * Agrega el header Authorization: Bearer <token> si hay token en localStorage.
 */
export async function authFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResult<T>> {
  const token = localStorage.getItem('token');
  const start = performance.now();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const duration = Math.round(performance.now() - start);
    const json = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      data: json,
      duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    return {
      ok: false,
      status: 0,
      data: null,
      duration,
      error: err instanceof Error ? err.message : 'Error de conexión desconocido',
    };
  }
}

/**
 * Fetch público (sin token) para endpoints de auth.
 */
export async function publicFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResult<T>> {
  const start = performance.now();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const duration = Math.round(performance.now() - start);
    const json = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      data: json,
      duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    return {
      ok: false,
      status: 0,
      data: null,
      duration,
      error: err instanceof Error ? err.message : 'Error de conexión desconocido',
    };
  }
}
