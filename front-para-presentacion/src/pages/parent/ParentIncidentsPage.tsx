import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { studentsApi } from '../../api/students.api';
import { incidentsApi } from '../../api/incidents.api';
import { useAuthStore } from '../../store/authStore';
import { StudentResponse } from '../../types/student.types';
import { IncidentResponse } from '../../types/incident.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import IncidentTimeline from '../../components/incidents/IncidentTimeline';
import { toast } from 'sonner';
import { GraduationCap, ChevronRight } from 'lucide-react';

export const ParentIncidentsPage: React.FC = () => {
  const [children, setChildren] = useState<StudentResponse[]>([]);
  const [selectedChild, setSelectedChild] = useState<StudentResponse | null>(null);
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncidentsLoading, setIsIncidentsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const { user } = useAuthStore();
  const location = useLocation();

  // Obtener ID del hijo redirigido desde el Dashboard si existe
  const redirectedStudentId = location.state?.selectedStudentId;

  // Cargar estudiantes del padre
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await studentsApi.getMyChildren();
        if (res.success && res.data) {
          const parentChildren = res.data;
          setChildren(parentChildren);

          // Seleccionar el redirigido o el primero por defecto
          if (parentChildren.length > 0) {
            const defaultChild = parentChildren.find(c => c.id === redirectedStudentId) || parentChildren[0];
            setSelectedChild(defaultChild);
          }
        }
      } catch (error) {
        console.error('Error al cargar hijos', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, [user, redirectedStudentId]);

  // Cargar incidencias del hijo seleccionado
  const fetchIncidentsForChild = async (childId: number) => {
    setIsIncidentsLoading(true);
    try {
      const res = await incidentsApi.getStudentIncidents(childId);
      if (res.success && res.data) {
        // Ordenar incidencias de más reciente a más antigua
        const active = res.data;
        setIncidents([...active].sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime()));
      }
    } catch (error) {
      console.error('Error al cargar incidencias del alumno', error);
    } finally {
      setIsIncidentsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChild) {
      fetchIncidentsForChild(selectedChild.id);
    } else {
      setIncidents([]);
    }
  }, [selectedChild]);

  // Marcar como leída
  const handleMarkAsRead = async (incidentId: number) => {
    setActionLoadingId(incidentId);
    try {
      const res = await incidentsApi.markAsRead(incidentId);
      if (res.success) {
        toast.success('Incidencia marcada como leída');
        // Refrescar incidencias en pantalla
        if (selectedChild) {
          fetchIncidentsForChild(selectedChild.id);
        }
      }
    } catch (error) {
      // Interceptado
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {children.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '48px' }}>
          No tienes estudiantes asignados a tu cuenta para ver reportes.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Lado Izquierdo: Lista de Hijos */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
              Mis Hijos
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map((c) => {
                const isSelected = selectedChild?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChild(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 'var(--radius-default)',
                      border: '1px solid var(--outline-variant)',
                      backgroundColor: isSelected ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <GraduationCap size={20} style={{ color: isSelected ? 'var(--primary)' : 'var(--outline)' }} />
                      <div>
                        <strong style={{ fontSize: '14px', color: isSelected ? 'var(--primary)' : 'var(--on-surface)' }}>
                          {c.firstName} {c.lastName}
                        </strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                          Código: {c.studentCode}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: isSelected ? 'var(--primary)' : 'var(--outline)' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lado Derecho: Timeline de Incidencias */}
          {selectedChild && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
                Timeline de Incidencias de {selectedChild.firstName}
              </h3>

              {isIncidentsLoading ? (
                <LoadingSpinner />
              ) : (
                <IncidentTimeline
                  incidents={incidents}
                  onMarkAsRead={handleMarkAsRead}
                  isActionLoading={actionLoadingId}
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ParentIncidentsPage;
