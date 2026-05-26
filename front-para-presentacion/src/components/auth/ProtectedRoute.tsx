import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types/auth.types';

interface ProtectedRouteProps {
  roles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated, user, checkTokenExpiry } = useAuthStore();

  // Validar si la sesión sigue activa
  const isSessionValid = isAuthenticated && checkTokenExpiry();

  if (!isSessionValid) {
    // Redirigir a login si no está autenticado o el token expiró
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // Si no tiene el rol necesario, lo redirige a su dashboard respectivo
    let redirectPath = '/login';
    switch (user.role) {
      case Role.COORDINADOR:
      case Role.ADMIN:
        redirectPath = '/coordinator';
        break;
      case Role.PROFESOR:
        redirectPath = '/teacher';
        break;
      case Role.PADRE:
        redirectPath = '/parent';
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  // Si está autenticado y tiene el rol permitido (o no hay restricciones), renderizar hijos
  return <Outlet />;
};

export default ProtectedRoute;
