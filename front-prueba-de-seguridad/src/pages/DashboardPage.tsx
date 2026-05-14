import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { username, email, role, userId } = useAuth();

  const endpointsByRole: Record<string, string[]> = {
    ADMIN: [
      'GET /api/users',
      'POST /api/users',
      'PUT /api/users/{id}',
      'DELETE /api/users/{id}',
      'GET /api/users/deleted',
      'PATCH /api/users/{id}/restore',
      'GET /api/students',
      'POST /api/students',
      'PUT /api/students/{id}',
      'DELETE /api/students/{id}',
      'GET /api/students/deleted',
      'GET /api/classes',
      'GET /api/classes/{id}',
    ],
    COORDINADOR: [
      'GET /api/users',
      'POST /api/users',
      'PUT /api/users/{id}',
      'GET /api/users/deleted',
      'PATCH /api/users/{id}/restore',
      'GET /api/students',
      'POST /api/students',
      'PUT /api/students/{id}',
      'DELETE /api/students/{id}',
      'GET /api/classes',
      'POST /api/classes',
      'PUT /api/classes/{id}',
      'DELETE /api/classes/{id}',
    ],
    PROFESOR: [
      'GET /api/classes/my-classes',
      'GET /api/classes/{id}',
      'GET /api/classes/{id}/students',
      'GET /api/students/{id}/details',
    ],
    PADRE: [
      'GET /api/students/my-children',
      'GET /api/students/{id}/details',
    ],
  };

  const availableEndpoints = role ? endpointsByRole[role] || [] : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>Información del usuario autenticado y endpoints disponibles</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>👤 Usuario Autenticado</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{userId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Username</span>
              <span className="info-value">{username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rol</span>
              <span className={`role-badge role-${role?.toLowerCase()}`}>{role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Token</span>
              <span className="info-value token-preview">
                {localStorage.getItem('token')?.substring(0, 30)}...
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>🔗 Endpoints Disponibles ({role})</h2>
          </div>
          <div className="endpoints-list">
            {availableEndpoints.map((ep, i) => {
              const [method, path] = ep.split(' ');
              return (
                <div key={i} className="endpoint-item">
                  <span className={`method-badge method-${method.toLowerCase()}`}>{method}</span>
                  <code>{path}</code>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>ℹ️ Información de la API</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Base URL</span>
              <code className="info-value">http://localhost:8080</code>
            </div>
            <div className="info-item">
              <span className="info-label">Prefijo</span>
              <code className="info-value">/api</code>
            </div>
            <div className="info-item">
              <span className="info-label">Auth</span>
              <span className="info-value">JWT Bearer Token</span>
            </div>
            <div className="info-item">
              <span className="info-label">Token Expira</span>
              <span className="info-value">20 minutos</span>
            </div>
            <div className="info-item">
              <span className="info-label">Swagger</span>
              <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noopener noreferrer" className="info-value link">
                /swagger-ui/index.html
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
