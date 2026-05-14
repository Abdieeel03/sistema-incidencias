import { useState, type FormEvent } from 'react';
import { userService } from '../services/user.service';
import { ResponseViewer } from '../components/ResponseViewer';
import { Role } from '../types/common.types';
import type { FetchResult } from '../api/client';

export function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<FetchResult<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('list');

  // Create user state
  const [createEmail, setCreateEmail] = useState('');
  const [createName, setCreateName] = useState('');
  const [createDni, setCreateDni] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<Role>(Role.PROFESOR);

  // Get/Update/Delete by ID
  const [targetId, setTargetId] = useState('');

  // Update user state
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateName, setUpdateName] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exec = async (fn: () => Promise<FetchResult<any>>) => {
    setLoading(true);
    setResult(null);
    const res = await fn();
    setResult(res);
    setLoading(false);
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => userService.create({
      email: createEmail,
      name: createName,
      dni: createDni,
      password: createPassword,
      role: createRole,
    }));
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => userService.update(Number(targetId), {
      email: updateEmail,
      name: updateName,
    }));
  };

  const sections = [
    { key: 'list', label: 'Listar', method: 'GET', path: '/api/users' },
    { key: 'create', label: 'Crear', method: 'POST', path: '/api/users' },
    { key: 'getById', label: 'Por ID', method: 'GET', path: '/api/users/{id}' },
    { key: 'update', label: 'Actualizar', method: 'PUT', path: '/api/users/{id}' },
    { key: 'delete', label: 'Eliminar', method: 'DELETE', path: '/api/users/{id}' },
    { key: 'deleted', label: 'Eliminados', method: 'GET', path: '/api/users/deleted' },
    { key: 'restore', label: 'Restaurar', method: 'PATCH', path: '/api/users/{id}/restore' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>👤 Gestión de Usuarios</h1>
        <p>Endpoints CRUD para usuarios — Requiere rol ADMIN o COORDINADOR</p>
      </div>

      <div className="section-tabs">
        {sections.map((s) => (
          <button
            key={s.key}
            className={`tab ${activeSection === s.key ? 'active' : ''}`}
            onClick={() => { setActiveSection(s.key); setResult(null); }}
          >
            <span className={`method-badge method-${s.method.toLowerCase()}`}>{s.method}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="section-content">
        {/* LISTAR */}
        {activeSection === 'list' && (
          <div className="card">
            <div className="card-header">
              <h2>Listar Usuarios</h2>
              <code className="endpoint-badge">GET /api/users</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => userService.getAll())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ejecutar'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* CREAR */}
        {activeSection === 'create' && (
          <div className="card">
            <div className="card-header">
              <h2>Crear Usuario</h2>
              <code className="endpoint-badge">POST /api/users</code>
            </div>
            <form onSubmit={handleCreate} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-name">Nombre</label>
                  <input id="create-name" type="text" placeholder="María García" value={createName} onChange={(e) => setCreateName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-email">Email</label>
                  <input id="create-email" type="email" placeholder="maria@email.com" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} required maxLength={150} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-dni">DNI (8 dígitos)</label>
                  <input id="create-dni" type="text" placeholder="87654321" value={createDni} onChange={(e) => setCreateDni(e.target.value)} required pattern="\d{8}" maxLength={8} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-password">Password</label>
                  <input id="create-password" type="password" placeholder="mínimo 8 caracteres" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required minLength={8} maxLength={100} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="create-role">Rol</label>
                <select id="create-role" value={createRole} onChange={(e) => setCreateRole(e.target.value as Role)}>
                  <option value={Role.ADMIN}>ADMIN</option>
                  <option value={Role.COORDINADOR}>COORDINADOR</option>
                  <option value={Role.PROFESOR}>PROFESOR</option>
                  <option value={Role.PADRE}>PADRE</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* GET BY ID */}
        {activeSection === 'getById' && (
          <div className="card">
            <div className="card-header">
              <h2>Obtener Usuario por ID</h2>
              <code className="endpoint-badge">GET /api/users/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="get-user-id">ID del usuario</label>
                <input id="get-user-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => userService.getById(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* UPDATE */}
        {activeSection === 'update' && (
          <div className="card">
            <div className="card-header">
              <h2>Actualizar Usuario</h2>
              <code className="endpoint-badge">PUT /api/users/{'id'}</code>
            </div>
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label htmlFor="update-user-id">ID del usuario</label>
                <input id="update-user-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} required min={1} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-name">Nuevo nombre</label>
                  <input id="update-name" type="text" placeholder="Nuevo Nombre" value={updateName} onChange={(e) => setUpdateName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="update-email">Nuevo email</label>
                  <input id="update-email" type="email" placeholder="nuevo@email.com" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} required maxLength={150} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* DELETE */}
        {activeSection === 'delete' && (
          <div className="card">
            <div className="card-header">
              <h2>Eliminar Usuario (Soft Delete)</h2>
              <code className="endpoint-badge">DELETE /api/users/{'id'}</code>
            </div>
            <p className="warning-text">⚠️ Solo ADMIN puede eliminar usuarios</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delete-user-id">ID del usuario</label>
                <input id="delete-user-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-danger" onClick={() => exec(() => userService.delete(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* DELETED USERS */}
        {activeSection === 'deleted' && (
          <div className="card">
            <div className="card-header">
              <h2>Usuarios Eliminados</h2>
              <code className="endpoint-badge">GET /api/users/deleted</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => userService.getDeleted())} disabled={loading}>
              {loading ? 'Cargando...' : 'Listar Eliminados'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* RESTORE */}
        {activeSection === 'restore' && (
          <div className="card">
            <div className="card-header">
              <h2>Restaurar Usuario</h2>
              <code className="endpoint-badge">PATCH /api/users/{'id'}/restore</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="restore-user-id">ID del usuario</label>
                <input id="restore-user-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => userService.restore(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Restaurando...' : 'Restaurar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}
