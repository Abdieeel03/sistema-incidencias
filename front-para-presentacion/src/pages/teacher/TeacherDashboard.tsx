import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../api/classes.api';
import { incidentsApi } from '../../api/incidents.api';
import { SchoolClassResponse } from '../../types/class.types';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { School, AlertTriangle, Plus, FileText, ArrowRight, Eye, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const TeacherDashboard: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classesRes, incidentsRes] = await Promise.all([
          classesApi.getMyClasses(),
          incidentsApi.getMyIncidents(),
        ]);
        if (classesRes.success) setClasses(classesRes.data);
        if (incidentsRes.success) setIncidents(incidentsRes.data);
      } catch (error) {
        console.error('Error al cargar datos del profesor', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const activeClasses = classes;
  const activeIncidents = incidents;
  const pendingIncidents = activeIncidents.filter(i => i.status === IncidentStatus.NO_LEIDA);

  const recentIncidents = [...activeIncidents]
    .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime())
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Bienvenida */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
            ¡Bienvenido, Profesor!
          </h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Aquí puedes registrar incidencias de conducta y hacer seguimiento del estado de lectura.
          </p>
        </div>
        <Button onClick={() => navigate('/teacher/incidents/new')} style={{ gap: '8px' }}>
          <Plus size={18} />
          Reportar Incidencia
        </Button>
      </div>

      {/* Grid Resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* KPI: Aulas */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(0, 40, 142, 0.1)',
            color: 'var(--primary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <School size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Mis Aulas Asignadas
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {activeClasses.length}
            </h3>
          </div>
        </div>

        {/* KPI: Incidencias */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--status-critical)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Incidencias Reportadas
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {activeIncidents.length}
            </h3>
          </div>
        </div>

        {/* KPI: Pendientes */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--status-pending)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Clock size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Pendientes de Lectura
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {pendingIncidents.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Historial rápido */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
              Reportes Recientes
            </h3>
            <Button variant="ghost" onClick={() => navigate('/teacher/incidents')} style={{ fontSize: '13px', gap: '4px' }}>
              Ver todo <ArrowRight size={14} />
            </Button>
          </div>

          {recentIncidents.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '24px' }}>
              No has reportado incidencias recientemente.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentIncidents.map((incident) => (
                <div key={incident.id} style={{
                  padding: '16px',
                  backgroundColor: 'var(--surface-container-low)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-default)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)' }}>
                      {incident.title}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px', display: 'block' }}>
                      Alumno: <strong>{incident.studentName}</strong> | Aula: <strong>{incident.className}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: incident.status === IncidentStatus.NO_LEIDA ? 'var(--status-pending-bg)' : 'var(--status-resolved-bg)',
                      color: incident.status === IncidentStatus.NO_LEIDA ? 'var(--status-pending)' : 'var(--status-resolved)'
                    }}>
                      {incident.status === IncidentStatus.NO_LEIDA ? 'Pendiente' : 'Leída'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--outline)' }}>
                      {formatDate(incident.incidentDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos rápidos e instructivo */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
            Convivencia Escolar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '14px',
              backgroundColor: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-default)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13px'
            }}>
              <FileText size={20} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>¿Cómo reportar?</strong>
                <p style={{ color: 'var(--on-surface-variant)', marginTop: '4px', lineHeight: 1.4 }}>
                  Selecciona el aula, escoge el alumno e indica los hechos con la mayor claridad y respeto posible. El apoderado será notificado al instante.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate('/teacher/classes')}
              style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 16px' }}
            >
              <School size={16} />
              Ver mis Aulas asignadas
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
