import React, { useEffect, useState } from 'react';
import { incidentsApi } from '../../api/incidents.api';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import StatusChip from '../../components/common/StatusChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import Modal from '../../components/common/Modal';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');

  // Detalle Modal
  const [selectedIncident, setSelectedIncident] = useState<IncidentResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchIncidents = async () => {
    try {
      const res = await incidentsApi.getIncidents();
      if (res.success) {
        setIncidents(res.data);
      }
    } catch (error) {
      console.error('Error al listar incidencias', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Filtrado
  useEffect(() => {
    let result = [...incidents];

    if (statusFilter !== 'ALL') {
      result = result.filter(i => i.status === statusFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        i =>
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.className.toLowerCase().includes(term) ||
          i.studentName.toLowerCase().includes(term) ||
          i.teacherName.toLowerCase().includes(term)
      );
    }

    setFilteredIncidents(result);
  }, [incidents, search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Controles de Búsqueda y Filtro */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--outline)'
          }} />
          <input
            type="text"
            placeholder="Buscar por título, alumno, profesor o aula..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <select
          className="form-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{ width: '180px' }}
        >
          <option value="ALL">Todos los Estados</option>
          <option value={IncidentStatus.NO_LEIDA}>No Leídas</option>
          <option value={IncidentStatus.LEIDA}>Leídas</option>
        </select>
      </div>

      {/* Tabla de Incidencias */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Alumno</th>
                <th>Aula</th>
                <th>Reportado por</th>
                <th>Fecha de Reporte</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Ver</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                    No se encontraron registros de incidencias.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{incident.title}</span>
                    </td>
                    <td>{incident.studentName}</td>
                    <td>{incident.className}</td>
                    <td>{incident.teacherName}</td>
                    <td>{formatDate(incident.incidentDate)}</td>
                    <td>
                      <StatusChip status={incident.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setSelectedIncident(incident);
                          setIsDetailOpen(true);
                        }}
                        title="Ver detalle de incidencia"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalle de Incidencia */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Detalles de Incidencia"
      >
        {selectedIncident && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusChip status={selectedIncident.status} />
              <span style={{ fontSize: '12px', color: 'var(--outline)' }}>
                {formatDate(selectedIncident.incidentDate)}
              </span>
            </div>

            <div>
              <h4 className="headline-sm" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
                {selectedIncident.title}
              </h4>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--on-surface-variant)',
                backgroundColor: 'var(--surface-container-low)',
                padding: '16px',
                borderRadius: 'var(--radius-default)',
                border: '1px solid var(--outline-variant)'
              }}>
                {selectedIncident.description}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--outline-variant)',
              fontSize: '13px'
            }}>
              <div>
                <span style={{ display: 'block', color: 'var(--outline)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                  Alumno Afectado
                </span>
                <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                  {selectedIncident.studentName}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--outline)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                  Aula / Clase
                </span>
                <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                  {selectedIncident.className}
                </span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span style={{ display: 'block', color: 'var(--outline)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                  Docente Reportante
                </span>
                <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                  {selectedIncident.teacherName}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default IncidentsPage;
