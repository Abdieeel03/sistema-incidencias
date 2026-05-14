import { useState, type FormEvent } from 'react';
import { studentService } from '../services/student.service';
import { ResponseViewer } from '../components/ResponseViewer';
import type { FetchResult } from '../api/client';

export function StudentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<FetchResult<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('list');

  // Create state
  const [createFirstName, setCreateFirstName] = useState('');
  const [createLastName, setCreateLastName] = useState('');
  const [createDni, setCreateDni] = useState('');
  const [createParentId, setCreateParentId] = useState('');

  // ID operations
  const [targetId, setTargetId] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Parent ID
  const [parentId, setParentId] = useState('');

  // Update state
  const [updateFirstName, setUpdateFirstName] = useState('');
  const [updateLastName, setUpdateLastName] = useState('');
  const [updateDni, setUpdateDni] = useState('');
  const [updateParentId, setUpdateParentId] = useState('');

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
    exec(() => studentService.create({
      firstName: createFirstName,
      lastName: createLastName,
      dni: createDni,
      parentId: Number(createParentId),
    }));
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => studentService.update(Number(targetId), {
      firstName: updateFirstName,
      lastName: updateLastName,
      dni: updateDni,
      parentId: Number(updateParentId),
    }));
  };

  const sections = [
    { key: 'list', label: 'Listar', method: 'GET', path: '/api/students' },
    { key: 'create', label: 'Crear', method: 'POST', path: '/api/students' },
    { key: 'getById', label: 'Por ID', method: 'GET', path: '/api/students/{id}' },
    { key: 'details', label: 'Detalles', method: 'GET', path: '/api/students/{id}/details' },
    { key: 'search', label: 'Buscar', method: 'GET', path: '/api/students/search' },
    { key: 'byParent', label: 'Por Padre', method: 'GET', path: '/api/students/parent/{id}' },
    { key: 'myChildren', label: 'Mis Hijos', method: 'GET', path: '/api/students/my-children' },
    { key: 'update', label: 'Actualizar', method: 'PUT', path: '/api/students/{id}' },
    { key: 'delete', label: 'Eliminar', method: 'DELETE', path: '/api/students/{id}' },
    { key: 'deleted', label: 'Eliminados', method: 'GET', path: '/api/students/deleted' },
    { key: 'restore', label: 'Restaurar', method: 'PATCH', path: '/api/students/{id}/restore' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎓 Gestión de Estudiantes</h1>
        <p>Endpoints CRUD para estudiantes</p>
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
        {activeSection === 'list' && (
          <div className="card">
            <div className="card-header">
              <h2>Listar Estudiantes</h2>
              <code className="endpoint-badge">GET /api/students</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => studentService.getAll())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ejecutar'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'create' && (
          <div className="card">
            <div className="card-header">
              <h2>Crear Estudiante</h2>
              <code className="endpoint-badge">POST /api/students</code>
            </div>
            <form onSubmit={handleCreate} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-student-fname">Nombre</label>
                  <input id="create-student-fname" type="text" placeholder="Carlos" value={createFirstName} onChange={(e) => setCreateFirstName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-student-lname">Apellido</label>
                  <input id="create-student-lname" type="text" placeholder="Pérez" value={createLastName} onChange={(e) => setCreateLastName(e.target.value)} required maxLength={100} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-student-dni">DNI (8 dígitos)</label>
                  <input id="create-student-dni" type="text" placeholder="12348765" value={createDni} onChange={(e) => setCreateDni(e.target.value)} required pattern="\d{8}" maxLength={8} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-student-parent">Parent ID</label>
                  <input id="create-student-parent" type="number" placeholder="5" value={createParentId} onChange={(e) => setCreateParentId(e.target.value)} required min={1} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Estudiante'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'getById' && (
          <div className="card">
            <div className="card-header">
              <h2>Obtener Estudiante por ID</h2>
              <code className="endpoint-badge">GET /api/students/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="get-student-id">ID</label>
                <input id="get-student-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => studentService.getById(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'details' && (
          <div className="card">
            <div className="card-header">
              <h2>Detalle Completo de Estudiante</h2>
              <code className="endpoint-badge">GET /api/students/{'id'}/details</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="detail-student-id">ID</label>
                <input id="detail-student-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => studentService.getDetails(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Ver Detalles'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'search' && (
          <div className="card">
            <div className="card-header">
              <h2>Buscar Estudiantes</h2>
              <code className="endpoint-badge">GET /api/students/search?query=</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="search-student-query">Búsqueda</label>
                <input id="search-student-query" type="text" placeholder="carlos" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => studentService.search(searchQuery))} disabled={loading || !searchQuery}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'byParent' && (
          <div className="card">
            <div className="card-header">
              <h2>Estudiantes por Padre</h2>
              <code className="endpoint-badge">GET /api/students/parent/{'parentId'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parent-id-input">Parent ID</label>
                <input id="parent-id-input" type="number" placeholder="5" value={parentId} onChange={(e) => setParentId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => studentService.getByParent(Number(parentId)))} disabled={loading || !parentId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'myChildren' && (
          <div className="card">
            <div className="card-header">
              <h2>Mis Hijos (Solo PADRE)</h2>
              <code className="endpoint-badge">GET /api/students/my-children</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => studentService.getMyChildren())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ver Mis Hijos'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'update' && (
          <div className="card">
            <div className="card-header">
              <h2>Actualizar Estudiante</h2>
              <code className="endpoint-badge">PUT /api/students/{'id'}</code>
            </div>
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label htmlFor="update-student-id">ID del estudiante</label>
                <input id="update-student-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} required min={1} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-student-fname">Nombre</label>
                  <input id="update-student-fname" type="text" placeholder="Carlos" value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="update-student-lname">Apellido</label>
                  <input id="update-student-lname" type="text" placeholder="Pérez Gómez" value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value)} required maxLength={100} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-student-dni">DNI</label>
                  <input id="update-student-dni" type="text" placeholder="12348765" value={updateDni} onChange={(e) => setUpdateDni(e.target.value)} required pattern="\d{8}" maxLength={8} />
                </div>
                <div className="form-group">
                  <label htmlFor="update-student-parent">Parent ID</label>
                  <input id="update-student-parent" type="number" placeholder="5" value={updateParentId} onChange={(e) => setUpdateParentId(e.target.value)} required min={1} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'delete' && (
          <div className="card">
            <div className="card-header">
              <h2>Eliminar Estudiante</h2>
              <code className="endpoint-badge">DELETE /api/students/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delete-student-id">ID</label>
                <input id="delete-student-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-danger" onClick={() => exec(() => studentService.delete(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'deleted' && (
          <div className="card">
            <div className="card-header">
              <h2>Estudiantes Eliminados</h2>
              <code className="endpoint-badge">GET /api/students/deleted</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => studentService.getDeleted())} disabled={loading}>
              {loading ? 'Cargando...' : 'Listar Eliminados'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'restore' && (
          <div className="card">
            <div className="card-header">
              <h2>Restaurar Estudiante</h2>
              <code className="endpoint-badge">PATCH /api/students/{'id'}/restore</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="restore-student-id">ID</label>
                <input id="restore-student-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => studentService.restore(Number(targetId)))} disabled={loading || !targetId}>
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
