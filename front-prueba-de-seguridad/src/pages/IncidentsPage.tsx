import { useState, type FormEvent } from 'react';
import { incidentService } from '../services/incident.service';
import { ResponseViewer } from '../components/ResponseViewer';
import type { FetchResult } from '../api/client';

export function IncidentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<FetchResult<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('list');

  // Create state
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createStudentId, setCreateStudentId] = useState('');
  const [createClassId, setCreateClassId] = useState('');

  // ID operations
  const [targetId, setTargetId] = useState('');

  // Filter by student/class
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');

  // Update state
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateStudentId, setUpdateStudentId] = useState('');
  const [updateClassId, setUpdateClassId] = useState('');

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
    exec(() => incidentService.create({
      title: createTitle,
      description: createDescription,
      studentId: Number(createStudentId),
      classId: Number(createClassId),
    }));
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    exec(() => incidentService.update(Number(targetId), {
      title: updateTitle,
      description: updateDescription,
      studentId: Number(updateStudentId),
      classId: Number(updateClassId),
    }));
  };

  const sections = [
    { key: 'list', label: 'Listar', method: 'GET', path: '/api/incidents' },
    { key: 'create', label: 'Crear', method: 'POST', path: '/api/incidents' },
    { key: 'getById', label: 'Por ID', method: 'GET', path: '/api/incidents/{id}' },
    { key: 'myIncidents', label: 'Mis Incidencias', method: 'GET', path: '/api/incidents/my-incidents' },
    { key: 'byStudent', label: 'Por Estudiante', method: 'GET', path: '/api/incidents/student/{id}' },
    { key: 'byClass', label: 'Por Clase', method: 'GET', path: '/api/incidents/class/{id}' },
    { key: 'update', label: 'Actualizar', method: 'PUT', path: '/api/incidents/{id}' },
    { key: 'markRead', label: 'Marcar Leída', method: 'PATCH', path: '/api/incidents/{id}/read' },
    { key: 'delete', label: 'Eliminar', method: 'DELETE', path: '/api/incidents/{id}' },
    { key: 'deleted', label: 'Eliminados', method: 'GET', path: '/api/incidents/deleted' },
    { key: 'restore', label: 'Restaurar', method: 'PUT', path: '/api/incidents/restore/{id}' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Gestión de Incidencias</h1>
        <p>Endpoints completos para incidencias escolares — 11 endpoints operativos</p>
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
        {/* LISTAR TODAS */}
        {activeSection === 'list' && (
          <div className="card">
            <div className="card-header">
              <h2>Listar Incidencias</h2>
              <code className="endpoint-badge">GET /api/incidents</code>
            </div>
            <p className="role-hint">🔒 Roles: ADMIN, COORDINADOR</p>
            <button className="btn btn-primary" onClick={() => exec(() => incidentService.getAll())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ejecutar'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* CREAR */}
        {activeSection === 'create' && (
          <div className="card">
            <div className="card-header">
              <h2>Crear Incidencia</h2>
              <code className="endpoint-badge">POST /api/incidents</code>
            </div>
            <p className="role-hint">🔒 Rol: PROFESOR — El teacherId se extrae automáticamente del JWT</p>
            <form onSubmit={handleCreate} className="form">
              <div className="form-group">
                <label htmlFor="create-incident-title">Título</label>
                <input id="create-incident-title" type="text" placeholder="Falta de conducta" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} required maxLength={150} />
              </div>
              <div className="form-group">
                <label htmlFor="create-incident-desc">Descripción</label>
                <textarea
                  id="create-incident-desc"
                  placeholder="Descripción detallada de la incidencia..."
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-incident-student">Student ID</label>
                  <input id="create-incident-student" type="number" placeholder="1" value={createStudentId} onChange={(e) => setCreateStudentId(e.target.value)} required min={1} />
                </div>
                <div className="form-group">
                  <label htmlFor="create-incident-class">Class ID</label>
                  <input id="create-incident-class" type="number" placeholder="1" value={createClassId} onChange={(e) => setCreateClassId(e.target.value)} required min={1} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Incidencia'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* GET BY ID */}
        {activeSection === 'getById' && (
          <div className="card">
            <div className="card-header">
              <h2>Obtener Incidencia por ID</h2>
              <code className="endpoint-badge">GET /api/incidents/{'id'}</code>
            </div>
            <p className="role-hint">🔒 Autenticado con acceso</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="get-incident-id">ID</label>
                <input id="get-incident-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => incidentService.getById(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* MIS INCIDENCIAS */}
        {activeSection === 'myIncidents' && (
          <div className="card">
            <div className="card-header">
              <h2>Mis Incidencias</h2>
              <code className="endpoint-badge">GET /api/incidents/my-incidents</code>
            </div>
            <p className="role-hint">🔒 Rol: PROFESOR — Retorna incidencias creadas por el profesor autenticado</p>
            <button className="btn btn-primary" onClick={() => exec(() => incidentService.getMyIncidents())} disabled={loading}>
              {loading ? 'Cargando...' : 'Ver Mis Incidencias'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* POR ESTUDIANTE */}
        {activeSection === 'byStudent' && (
          <div className="card">
            <div className="card-header">
              <h2>Incidencias por Estudiante</h2>
              <code className="endpoint-badge">GET /api/incidents/student/{'studentId'}</code>
            </div>
            <p className="role-hint">🔒 Autenticado con acceso</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="incident-student-id">Student ID</label>
                <input id="incident-student-id" type="number" placeholder="1" value={studentId} onChange={(e) => setStudentId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => incidentService.getByStudent(Number(studentId)))} disabled={loading || !studentId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* POR CLASE */}
        {activeSection === 'byClass' && (
          <div className="card">
            <div className="card-header">
              <h2>Incidencias por Clase</h2>
              <code className="endpoint-badge">GET /api/incidents/class/{'classId'}</code>
            </div>
            <p className="role-hint">🔒 Roles: ADMIN, COORDINADOR, PROFESOR</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="incident-class-id">Class ID</label>
                <input id="incident-class-id" type="number" placeholder="1" value={classId} onChange={(e) => setClassId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => incidentService.getByClass(Number(classId)))} disabled={loading || !classId}>
                {loading ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* ACTUALIZAR */}
        {activeSection === 'update' && (
          <div className="card">
            <div className="card-header">
              <h2>Actualizar Incidencia</h2>
              <code className="endpoint-badge">PUT /api/incidents/{'id'}</code>
            </div>
            <p className="role-hint">🔒 Rol: PROFESOR</p>
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label htmlFor="update-incident-id">ID de la incidencia</label>
                <input id="update-incident-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} required min={1} />
              </div>
              <div className="form-group">
                <label htmlFor="update-incident-title">Título</label>
                <input id="update-incident-title" type="text" placeholder="Título actualizado" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} required maxLength={150} />
              </div>
              <div className="form-group">
                <label htmlFor="update-incident-desc">Descripción</label>
                <textarea
                  id="update-incident-desc"
                  placeholder="Nueva descripción..."
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-incident-student">Student ID</label>
                  <input id="update-incident-student" type="number" placeholder="1" value={updateStudentId} onChange={(e) => setUpdateStudentId(e.target.value)} required min={1} />
                </div>
                <div className="form-group">
                  <label htmlFor="update-incident-class">Class ID</label>
                  <input id="update-incident-class" type="number" placeholder="1" value={updateClassId} onChange={(e) => setUpdateClassId(e.target.value)} required min={1} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </form>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* MARCAR COMO LEÍDA */}
        {activeSection === 'markRead' && (
          <div className="card">
            <div className="card-header">
              <h2>Marcar como Leída</h2>
              <code className="endpoint-badge">PATCH /api/incidents/{'id'}/read</code>
            </div>
            <p className="role-hint">🔒 Rol: PADRE — Cambia status de NO_LEIDA a LEIDA. No requiere body.</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="read-incident-id">ID de la incidencia</label>
                <input id="read-incident-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => incidentService.markAsRead(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Marcando...' : 'Marcar como Leída'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* DELETE */}
        {activeSection === 'delete' && (
          <div className="card">
            <div className="card-header">
              <h2>Eliminar Incidencia (Soft Delete)</h2>
              <code className="endpoint-badge">DELETE /api/incidents/{'id'}</code>
            </div>
            <p className="role-hint">🔒 Rol: PROFESOR</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delete-incident-id">ID</label>
                <input id="delete-incident-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-danger" onClick={() => exec(() => incidentService.delete(Number(targetId)))} disabled={loading || !targetId}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* ELIMINADOS */}
        {activeSection === 'deleted' && (
          <div className="card">
            <div className="card-header">
              <h2>Incidencias Eliminadas</h2>
              <code className="endpoint-badge">GET /api/incidents/deleted</code>
            </div>
            <p className="role-hint">🔒 Roles: COORDINADOR, PROFESOR</p>
            <button className="btn btn-primary" onClick={() => exec(() => incidentService.getDeleted())} disabled={loading}>
              {loading ? 'Cargando...' : 'Listar Eliminadas'}
            </button>
            <ResponseViewer result={result} loading={loading} />
          </div>
        )}

        {/* RESTAURAR */}
        {activeSection === 'restore' && (
          <div className="card">
            <div className="card-header">
              <h2>Restaurar Incidencia</h2>
              <code className="endpoint-badge">PUT /api/incidents/restore/{'id'}</code>
            </div>
            <p className="role-hint">🔒 Rol: PROFESOR</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="restore-incident-id">ID</label>
                <input id="restore-incident-id" type="number" placeholder="1" value={targetId} onChange={(e) => setTargetId(e.target.value)} min={1} />
              </div>
              <button className="btn btn-primary" onClick={() => exec(() => incidentService.restore(Number(targetId)))} disabled={loading || !targetId}>
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
