import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout() {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🏫 API Tester</h2>
          <p className="sidebar-subtitle">Incidencias Escolares</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            👤 Usuarios
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🎓 Estudiantes
          </NavLink>
          <NavLink to="/classes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🏫 Clases
          </NavLink>
          <NavLink to="/incidents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📋 Incidencias
          </NavLink>
          <NavLink to="/change-password" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🔑 Cambiar Contraseña
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{username}</span>
            <span className={`role-badge role-${role?.toLowerCase()}`}>{role}</span>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
