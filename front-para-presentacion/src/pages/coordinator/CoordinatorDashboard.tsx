import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import { studentsApi } from '../../api/students.api';
import { classesApi } from '../../api/classes.api';
import { incidentsApi } from '../../api/incidents.api';
import { Role } from '../../types/auth.types';
import { UserResponse } from '../../types/user.types';
import { StudentResponse } from '../../types/student.types';
import { SchoolClassResponse } from '../../types/class.types';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Users, 
  GraduationCap, 
  School, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CoordinatorDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersRes, studentsRes, classesRes, incidentsRes] = await Promise.all([
          usersApi.getUsers(),
          studentsApi.getStudents(),
          classesApi.getClasses(),
          incidentsApi.getIncidents(),
        ]);

        if (usersRes.success) setUsers(usersRes.data);
        if (studentsRes.success) setStudents(studentsRes.data);
        if (classesRes.success) setClasses(classesRes.data);
        if (incidentsRes.success) setIncidents(incidentsRes.data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  // Datos ya vienen filtrados (activos) del backend
  const activeTeachers = users.filter(u => u.role === Role.PROFESOR);
  const activeParents = users.filter(u => u.role === Role.PADRE);
  const activeStudents = students;
  const activeClasses = classes;
  const activeIncidents = incidents;

  // Estadísticas de incidencias
  const pendingIncidents = activeIncidents.filter(i => i.status === IncidentStatus.NO_LEIDA);
  const resolvedIncidents = activeIncidents.filter(i => i.status === IncidentStatus.LEIDA);
  
  const pendingPercentage = activeIncidents.length ? Math.round((pendingIncidents.length / activeIncidents.length) * 100) : 0;
  const resolvedPercentage = activeIncidents.length ? Math.round((resolvedIncidents.length / activeIncidents.length) * 100) : 0;

  // Últimas incidencias reportadas (máximo 5)
  const recentIncidents = [...activeIncidents]
    .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Saludo y bienvenida */}
      <div>
        <h1 className="headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          ¡Hola, Coordinador!
        </h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Aquí tienes el resumen del estado actual de la convivencia escolar.
        </p>
      </div>

      {/* Grid de Kpis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {/* KPI: Profesores */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(0, 40, 142, 0.1)',
            color: 'var(--primary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Profesores Activos
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {activeTeachers.length}
            </h3>
          </div>
        </div>

        {/* KPI: Alumnos */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--status-resolved)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Alumnos Registrados
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {activeStudents.length}
            </h3>
          </div>
        </div>

        {/* KPI: Aulas */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--status-pending)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <School size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Aulas Creadas
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
              Total Incidencias
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {activeIncidents.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Lado Izquierdo: Últimas Incidencias */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
              Últimas Incidencias Reportadas
            </h3>
          </div>

          {recentIncidents.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '24px' }}>
              No se registran incidencias reportadas en el sistema.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentIncidents.map((incident) => (
                <div key={incident.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--outline-variant)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)' }}>
                      {incident.title}
                    </span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                      <span>Alumno: <strong>{incident.studentName}</strong></span>
                      <span>Aula: <strong>{incident.className}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
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
                      {incident.status === IncidentStatus.NO_LEIDA ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                      {incident.status === IncidentStatus.NO_LEIDA ? 'No Leída' : 'Leída'}
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

        {/* Lado Derecho: Estadísticas visuales */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
            Estado de Convivencia
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Barra: Leídas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--status-resolved)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Leídas por Padres
                </span>
                <span>{resolvedPercentage}% ({resolvedIncidents.length})</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px' }}>
                <div style={{ width: `${resolvedPercentage}%`, height: '100%', backgroundColor: 'var(--status-resolved)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Barra: Pendientes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--status-pending)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Pendientes de Lectura
                </span>
                <span>{pendingPercentage}% ({pendingIncidents.length})</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px' }}>
                <div style={{ width: `${pendingPercentage}%`, height: '100%', backgroundColor: 'var(--status-pending)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Resumen de Padres */}
            <div style={{
              marginTop: '12px',
              padding: '16px',
              backgroundColor: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-default)',
              border: '1px solid var(--outline-variant)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
              <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                Hay un total de <strong>{activeParents.length}</strong> padres en el sistema velando por la convivencia de sus hijos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
