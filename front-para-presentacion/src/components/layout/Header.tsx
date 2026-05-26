import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Obtener nombre de la sección basado en la ruta
  const getSectionName = () => {
    const path = location.pathname;
    if (path.includes('/coordinator')) {
      if (path.includes('/users')) return 'Gestión de Profesores y Padres';
      if (path.includes('/students')) return 'Directorio de Estudiantes';
      if (path.includes('/classes')) return 'Gestión de Aulas';
      if (path.includes('/incidents')) return 'Listado General de Incidencias';
      return 'Panel del Coordinador';
    }
    if (path.includes('/teacher')) {
      if (path.includes('/classes')) return 'Mis Aulas Asignadas';
      if (path.includes('/incidents/new')) return 'Reportar Nueva Incidencia';
      if (path.includes('/incidents')) return 'Mis Incidencias Reportadas';
      return 'Panel del Profesor';
    }
    if (path.includes('/parent')) {
      if (path.includes('/incidents')) return 'Incidencias de mis Hijos';
      return 'Panel del Padre — Mis Hijos';
    }
    if (path.includes('/settings')) return 'Configuración del Perfil';
    if (path.includes('/students/')) return 'Detalles del Estudiante';
    return 'Sistema de Incidencias';
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--surface-container-lowest)',
      borderBottom: '1px solid var(--outline-variant)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Title / Breadcrumb */}
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--on-surface)',
          letterSpacing: '-0.01em'
        }}>
          {getSectionName()}
        </h2>
      </div>

      {/* Actions (Notifs, Profile info) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notifications Icon (Sutil) */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--on-surface-variant)',
          position: 'relative',
          padding: '8px',
          borderRadius: 'var(--radius-default)',
          transition: 'background var(--transition-fast)'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-container-low)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bell size={20} />
          {/* Badge de alerta de ejemplo para padres o coordinadores */}
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--status-critical)',
            borderRadius: '50%'
          }}></span>
        </button>

        {/* User text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--on-surface)'
          }}>
            {user?.name}
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--on-surface-variant)'
          }}>
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
