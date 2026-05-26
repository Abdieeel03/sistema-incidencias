import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '../../api/incidents.api';
import { classesApi } from '../../api/classes.api';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import { SchoolClassResponse } from '../../types/class.types';
import StatusChip from '../../components/common/StatusChip';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import IncidentForm from '../../components/incidents/IncidentForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { Search, Plus, Trash2, Edit, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const MyIncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<IncidentResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmaciones
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const loadData = async () => {
    try {
      const [incidentsRes, deletedIncidentsRes, classesRes] = await Promise.all([
        incidentsApi.getMyIncidents(),
        incidentsApi.getDeletedIncidents(),
        classesApi.getMyClasses(),
      ]);

      const active = incidentsRes.success ? incidentsRes.data.map(i => ({ ...i, isDeleted: false })) : [];
      const deleted = deletedIncidentsRes.success ? deletedIncidentsRes.data.map(i => ({ ...i, isDeleted: true })) : [];
      setIncidents([...active, ...deleted]);

      if (classesRes.success) setClasses(classesRes.data);
    } catch (error) {
      console.error('Error al cargar incidencias del profesor', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrado
  useEffect(() => {
    let result = incidents;

    if (!showDeleted) {
      result = result.filter(i => !i.isDeleted);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        i =>
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.className.toLowerCase().includes(term) ||
          i.studentName.toLowerCase().includes(term)
      );
    }

    setFilteredIncidents(result);
  }, [incidents, search, showDeleted]);

  const handleSave = async (data: { title: string; description: string }) => {
    if (!incidentToEdit) return;
    setIsSaving(true);
    try {
      const res = await incidentsApi.updateIncident(incidentToEdit.id, {
        ...data,
        studentId: incidentToEdit.studentId,
        classId: incidentToEdit.classId,
      });
      if (res.success) {
        toast.success('Incidencia actualizada correctamente');
        loadData();
        setIsFormOpen(false);
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIncident) return;
    setIsActionLoading(true);
    try {
      const res = await incidentsApi.deleteIncident(selectedIncident.id);
      if (res.success) {
        toast.success('Incidencia eliminada exitosamente');
        loadData();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedIncident) return;
    setIsActionLoading(true);
    try {
      const res = await incidentsApi.restoreIncident(selectedIncident.id);
      if (res.success) {
        toast.success('Incidencia restaurada con éxito');
        loadData();
        setIsRestoreOpen(false);
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Controles de Acción y Búsqueda */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Barra de Búsqueda */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px', minWidth: '300px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--outline)'
          }} />
          <input
            type="text"
            placeholder="Buscar por título, alumno o aula..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Botón de Registro */}
        <Button onClick={() => navigate('/teacher/incidents/new')} style={{ gap: '8px' }}>
          <Plus size={18} />
          Reportar Incidencia
        </Button>
      </div>

      {/* Toggle de Soft Delete */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <label className="switch-container">
          <div className="switch">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            <span className="slider"></span>
          </div>
          Mostrar incidencias eliminadas
        </label>
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
                <th>Fecha de Reporte</th>
                <th>Estado de Lectura</th>
                <th>Estado Registro</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                    No se encontraron incidencias reportadas.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id} style={{ opacity: incident.isDeleted ? 0.6 : 1 }}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{incident.title}</span>
                    </td>
                    <td>{incident.studentName}</td>
                    <td>{incident.className}</td>
                    <td>{formatDate(incident.incidentDate)}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: incident.status === IncidentStatus.NO_LEIDA ? 'var(--status-pending)' : 'var(--status-resolved)'
                      }}>
                        {incident.status === IncidentStatus.NO_LEIDA ? <Clock size={14} /> : <CheckCircle size={14} />}
                        {incident.status === IncidentStatus.NO_LEIDA ? 'Pendiente' : 'Leída'}
                      </span>
                    </td>
                    <td>
                      <StatusChip status={incident.isDeleted ? 'ELIMINADA' : 'ACTIVO'} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {!incident.isDeleted ? (
                          <>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setIncidentToEdit(incident);
                                setIsFormOpen(true);
                              }}
                              title="Editar reporte de incidencia"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setSelectedIncident(incident);
                                setIsDeleteOpen(true);
                              }}
                              title="Eliminar reporte de incidencia"
                              style={{ color: 'var(--error)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-ghost"
                            onClick={() => {
                              setSelectedIncident(incident);
                              setIsRestoreOpen(true);
                            }}
                            title="Restaurar reporte"
                            style={{ color: 'var(--primary)' }}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Editar Incidencia */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Editar Reporte de Incidencia"
      >
        <IncidentForm
          incidentToEdit={incidentToEdit}
          classes={classes}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Confirmar Eliminación */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Reporte"
        message={`¿Estás seguro de que deseas eliminar el reporte de incidencia: "${selectedIncident?.title}"?`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={isActionLoading}
      />

      {/* Confirmar Restauración */}
      <ConfirmDialog
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestore}
        title="Restaurar Reporte"
        message={`¿Deseas restaurar la incidencia: "${selectedIncident?.title}"?`}
        confirmText="Restaurar"
        isLoading={isActionLoading}
      />

    </div>
  );
};

export default MyIncidentsPage;
