import { useState, type FormEvent } from 'react';
import { classService } from '../services/class.service';
import { ResponseViewer } from '../components/ResponseViewer';
import type { FetchResult } from '../api/client';

export function ClassesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<FetchResult<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('list');

  // Create state
  const [createName, setCreateName] = useState('');
  const [createTeacherId, setCreateTeacherId] = useState('');
  const [createStudentIds, setCreateStudentIds] = useState('');

  // ID operations
  const [targetId, setTargetId] = useState('');

  // Update state
  const [updateName, setUpdateName] = useState('');
  const [updateTeacherId, setUpdateTeacherId] = useState('');
  const [updateStudentIds, setUpdateStudentIds] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exec = async (fn: () => Promise<FetchResult<any>>) => {
    setLoading(true);
    setResult(null);
    const res = await fn();
    setResult(res);
    setLoading(false);
  };

  const parseIds = (str: string): number[] => {
    if (!str.trim()) return [];
    return str.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n));
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => classService.create({
      name: createName,
      teacherId: Number(createTeacherId),
      studentIds: parseIds(createStudentIds),
    }));
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => classService.update(Number(targetId), {
      name: updateName,
      teacherId: Number(updateTeacherId),
      studentIds: parseIds(updateStudentIds),
    }));
  };

  const sections = [
    { key: 'list', label: 'Listar', method: 'GET', path: '/api/classes' },
    { key: 'create', label: 'Crear', method: 'POST', path: '/api/classes' },
    { key: 'getById', label: 'Por ID', method: 'GET', path: '/api/classes/{id}' },
    { key: 'myClasses', label: 'Mis Clases', method: 'GET', path: '/api/classes/my-classes' },
    { key: 'students', label: 'Estudiantes', method: 'GET', path: '/api/classes/{id}/students' },
    { key: 'update', label: 'Actualizar', method: 'PUT', path: '/api/classes/{id}' },
    { key: 'delete', label: 'Eliminar', method: 'DELETE', path: '/api/classes/{id}' },
    { key: 'deleted', label: 'Eliminados', method: 'GET', path: '/api/classes/deleted' },
    { key: 'restore', label: 'Restaurar', method: 'PUT', path: '/api/classes/restore/{id}' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏫 Gestión de Clases</h1>
        <p>Endpoints CRUD para clases escolares</p>
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
              <h2>Listar Clases</h2>
              <code className="endpoint-badge">GET /api/classes</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => classService.getAll())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ejecutar'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'create' && (
          <div className="card">
            <div className="card-header">
              <h2>Crear Clase</h2>
              <code className="endpoint-badge">POST /api/classes</code>
            </div>
            <form onSubmit={handleCreate} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-class-name">Nombre de la clase</label>
                  <input id="create-class-name" type="text" placeholder="Matemáticas 3A" value={createName} onChange={(e) => setCreateName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-class-teacher">Teacher ID</label>
                  <input id="create-class-teacher" type="number" placeholder="2" value={createTeacherId} onChange={(e) => setCreateTeacherId(e.target.value)} required min={1} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="create-class-students">Student IDs (separados por coma, opcional)</label>
                <input id="create-class-students" type="text" placeholder="1, 3, 5" value={createStudentIds} onChange={(e) => setCreateStudentIds(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Clase'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'getById' && (
          <div className="card">
            <div className="card-header">
              <h2>Obtener Clase por ID</h2>
              <code className="endpoint-badge">GET /api/classes/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="get-class-id">ID</label>
                <input id="get-class-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => classService.getById(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'myClasses' && (
          <div className="card">
            <div className="card-header">
              <h2>Mis Clases (Solo PROFESOR)</h2>
              <code className="endpoint-badge">GET /api/classes/my-classes</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => classService.getMyClasses())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ver Mis Clases'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'students' && (
          <div className="card">
            <div className="card-header">
              <h2>Estudiantes de una Clase</h2>
              <code className="endpoint-badge">GET /api/classes/{'id'}/students</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="class-students-id">ID de la clase</label>
                <input id="class-students-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => classService.getStudents(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Ver Estudiantes'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'update' && (
          <div className="card">
            <div className="card-header">
              <h2>Actualizar Clase</h2>
              <code className="endpoint-badge">PUT /api/classes/{'id'}</code>
            </div>
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label htmlFor="update-class-id">ID de la clase</label>
                <input id="update-class-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} required min={1} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-class-name">Nombre</label>
                  <input id="update-class-name" type="text" placeholder="Matemáticas 3B" value={updateName} onChange={(e) => setUpdateName(e.target.value)} required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="update-class-teacher">Teacher ID</label>
                  <input id="update-class-teacher" type="number" placeholder="2" value={updateTeacherId} onChange={(e) => setUpdateTeacherId(e.target.value)} required min={1} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="update-class-students">Student IDs (separados por coma)</label>
                <input id="update-class-students" type="text" placeholder="1, 3, 5" value={updateStudentIds} onChange={(e) => setUpdateStudentIds(e.target.value)} />
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
              <h2>Eliminar Clase</h2>
              <code className="endpoint-badge">DELETE /api/classes/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delete-class-id">ID</label>
                <input id="delete-class-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-danger" onClick={() => exec(() => classService.delete(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'deleted' && (
          <div className="card">
            <div className="card-header">
              <h2>Clases Eliminadas</h2>
              <code className="endpoint-badge">GET /api/classes/deleted</code>
            </div>
            <button className="btn btn-primary" onClick={() => exec(() => classService.getDeleted())} disabled={loading}>
              {loading ? 'Cargando...' : 'Listar Eliminadas'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {activeSection === 'restore' && (
          <div className="card">
            <div className="card-header">
              <h2>Restaurar Clase</h2>
              <code className="endpoint-badge">PUT /api/classes/restore/{'id'}</code>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="restore-class-id">ID</label>
                <input id="restore-class-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => classService.restore(Number(targetId)))} disabled={loading || !targetId}>
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
