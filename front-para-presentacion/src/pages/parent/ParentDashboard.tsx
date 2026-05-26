import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '../../api/students.api';
import { incidentsApi } from '../../api/incidents.api';
import { useAuthStore } from '../../store/authStore';
import { StudentResponse } from '../../types/student.types';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { GraduationCap, AlertTriangle, Eye, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface StudentCardData extends StudentResponse {
  totalIncidentsCount: number;
  pendingIncidentsCount: number;
}

export const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<StudentCardData[]>([]);
  const [globalStats, setGlobalStats] = useState({ total: 0, pending: 0, read: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadParentData = async () => {
      try {
        // Cargar los estudiantes
        const studentsRes = await studentsApi.getMyChildren();
        if (studentsRes.success && studentsRes.data) {
          const parentChildren = studentsRes.data;

          // Para cada hijo, obtener sus incidencias y calcular métricas
          let globalTotal = 0;
          let globalPending = 0;

          const childrenData: StudentCardData[] = await Promise.all(
            parentChildren.map(async (child) => {
              const incidentsRes = await incidentsApi.getStudentIncidents(child.id);
              let total = 0;
              let pending = 0;

              if (incidentsRes.success && incidentsRes.data) {
                const activeIncidents = incidentsRes.data;
                total = activeIncidents.length;
                pending = activeIncidents.filter(i => i.status === IncidentStatus.NO_LEIDA).length;
              }

              globalTotal += total;
              globalPending += pending;

              return {
                ...child,
                totalIncidentsCount: total,
                pendingIncidentsCount: pending,
              };
            })
          );

          setChildren(childrenData);
          setGlobalStats({
            total: globalTotal,
            pending: globalPending,
            read: globalTotal - globalPending
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del panel de padres', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParentData();
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Bienvenida */}
      <div>
        <h1 className="headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
          ¡Hola, Estimado Padre de Familia!
        </h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Aquí puedes estar al tanto de la conducta y la participación de tus hijos en la institución.
        </p>
      </div>

      {/* Resumen Alertas Globales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(0, 40, 142, 0.1)',
            color: 'var(--primary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Heart size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Mis Hijos Matriculados
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {children.length}
            </h3>
          </div>
        </div>

        <div className="card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderLeft: globalStats.pending > 0 ? '4px solid var(--status-pending)' : '1px solid var(--outline-variant)'
        }}>
          <div style={{
            backgroundColor: globalStats.pending > 0 ? 'var(--status-pending-bg)' : 'rgba(245, 158, 11, 0.1)',
            color: 'var(--status-pending)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Reportes Pendientes
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {globalStats.pending}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--status-resolved)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
              Reportes Leídos
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--on-surface)', marginTop: '4px' }}>
              {globalStats.read}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid de Hijos */}
      <div>
        <h3 className="headline-sm" style={{ color: 'var(--on-surface)', marginBottom: '16px' }}>
          Mis Hijos
        </h3>

        {children.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '48px' }}>
            No tienes estudiantes asociados a tu cuenta. Comunícate con la coordinación.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {children.map((child) => (
              <div
                key={child.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Nombre y Código */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: 'rgba(0, 40, 142, 0.1)',
                      color: 'var(--primary)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--on-surface)' }}>
                        {child.firstName} {child.lastName}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--outline)', fontWeight: 600 }}>
                        Código: {child.studentCode}
                      </span>
                    </div>
                  </div>

                  {/* Estadísticas de Incidencias */}
                  <div style={{
                    marginTop: '20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    backgroundColor: 'var(--surface-container-low)',
                    padding: '12px',
                    borderRadius: 'var(--radius-default)',
                    border: '1px solid var(--outline-variant)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                        INCIDENCIAS
                      </span>
                      <strong style={{ display: 'block', fontSize: '18px', color: 'var(--on-surface)', marginTop: '4px' }}>
                        {child.totalIncidentsCount}
                      </strong>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid var(--outline-variant)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--status-pending)', fontWeight: 700 }}>
                        PENDIENTES
                      </span>
                      <strong style={{ display: 'block', fontSize: '18px', color: 'var(--status-pending)', marginTop: '4px' }}>
                        {child.pendingIncidentsCount}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Enlace a Incidencias */}
                <button
                  onClick={() => navigate('/parent/incidents', { state: { selectedStudentId: child.id } })}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px'
                  }}
                >
                  Ver Reportes detallados
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ParentDashboard;
