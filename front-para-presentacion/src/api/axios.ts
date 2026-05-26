import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de petición para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globales (ej: 401 Expirado, 403 Denegado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const status = response.status;
      const message = response.data?.message || 'Ha ocurrido un error en el servidor';

      if (status === 401) {
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        if (!isAuthEndpoint) {
          // Redirigir a login y limpiar sesión solo si no es un endpoint de auth
          toast.error('Sesión expirada o inválida. Por favor, inicia sesión nuevamente.');
          useAuthStore.getState().logout();
          window.location.href = '/login';
        } else {
          // Si es login u otro de auth, mostrar el mensaje de error de credenciales
          toast.error(message);
        }
      } else if (status === 403) {
        toast.error('No tienes permisos suficientes para realizar esta acción.');
      } else if (status >= 500) {
        toast.error('Error interno del servidor. Inténtalo más tarde.');
      } else {
        // Errores 400 u otros
        toast.error(message);
      }
    } else {
      // Error de conexión a la red
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
