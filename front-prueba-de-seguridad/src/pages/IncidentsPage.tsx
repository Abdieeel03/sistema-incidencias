export function IncidentsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Incidencias</h1>
        <p>Módulo en construcción — Los endpoints aún no están expuestos en el backend</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>🚧 Módulo en Construcción</h2>
        </div>
        <p className="info-text">
          El módulo de incidencias tiene las entidades, DTOs y mappers creados en el backend
          pero <strong>aún no tiene controller ni service expuestos</strong>.
        </p>
      </div>

      <div className="incidents-preview">
        <div className="card">
          <div className="card-header">
            <h2>📤 CreateIncidentRequest</h2>
            <code className="endpoint-badge coming-soon">POST /api/incidents (pendiente)</code>
          </div>
          <pre className="response-body">
{JSON.stringify({
  title: "Falta de conducta",
  description: "Descripción detallada...",
  studentId: 1,
  classId: 1,
  teacherId: 2
}, null, 2)}
          </pre>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>📥 IncidentResponse</h2>
            <code className="endpoint-badge coming-soon">Estructura esperada</code>
          </div>
          <pre className="response-body">
{JSON.stringify({
  id: 1,
  title: "Falta de conducta",
  description: "El estudiante...",
  status: "NO_LEIDA",
  incidentDate: "2026-05-14T10:30:00",
  studentId: 1,
  studentName: "Carlos Pérez",
  classId: 1,
  className: "Matemáticas 3A",
  teacherId: 2,
  teacherName: "María García"
}, null, 2)}
          </pre>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>📝 UpdateIncidentRequest</h2>
            <code className="endpoint-badge coming-soon">PUT /api/incidents/{'{id}'} (pendiente)</code>
          </div>
          <pre className="response-body">
{JSON.stringify({
  title: "Título actualizado",
  description: "Nueva descripción",
  studentId: 1,
  classId: 1
}, null, 2)}
          </pre>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>📊 Enums del Módulo</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">IncidentStatus</span>
              <span className="info-value">
                <code>NO_LEIDA</code> | <code>LEIDA</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
