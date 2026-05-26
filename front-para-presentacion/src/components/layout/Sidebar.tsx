import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types/auth.types';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  AlertTriangle, 
  Settings, 
  LogOut,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case Role.ADMIN:
      case Role.COORDINADOR:
        return [
          { to: '/coordinator', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/coordinator/users', label: 'Profesores y Padres', icon: <Users size={20} /> },
          { to: '/coordinator/students', label: 'Estudiantes', icon: <GraduationCap size={20} /> },
          { to: '/coordinator/classes', label: 'Aulas', icon: <School size={20} /> },
          { to: '/coordinator/incidents', label: 'Incidencias', icon: <AlertTriangle size={20} /> },
        ];
      case Role.PROFESOR:
        return [
          { to: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/teacher/classes', label: 'Mis Aulas', icon: <School size={20} /> },
          { to: '/teacher/incidents', label: 'Mis Incidencias', icon: <AlertTriangle size={20} /> },
        ];
      case Role.PADRE:
        return [
          { to: '/parent', label: 'Panel (Hijos)', icon: <UserCheck size={20} /> },
          { to: '/parent/incidents', label: 'Incidencias', icon: <AlertTriangle size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getNavigationLinks();

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--surface-container-lowest)',
      borderRight: '1px solid var(--outline-variant)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--outline-variant)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 40, 142, 0.1)',
          color: 'var(--primary)',
          padding: '8px',
          borderRadius: 'var(--radius-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 style={{
            fontSize: '16px',
            fontWeight: 800,
            color: 'var(--on-surface)',
            lineHeight: 1.2
          }}>
            SAN IGNACIO
          </h1>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--on-surface-variant)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Incidencias
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{
        flex: 1,
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/coordinator' || link.to === '/teacher' || link.to === '/parent'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
              backgroundColor: isActive ? 'var(--surface-container-low)' : 'transparent',
              borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
              transition: 'all var(--transition-fast)',
              paddingLeft: isActive ? '20px' : '24px' // Compensate border left width
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        {/* Settings shared link */}
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            backgroundColor: isActive ? 'var(--surface-container-low)' : 'transparent',
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all var(--transition-fast)',
            paddingLeft: isActive ? '20px' : '24px',
            marginTop: 'auto'
          })}
        >
          <Settings size={20} />
          Configuración
        </NavLink>
      </nav>

      {/* User Session Footer */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid var(--outline-variant)',
        backgroundColor: '#f8f9ff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--on-surface)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {user?.name}
            </h4>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--radius-default)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
