import React from 'react';
import { StudentDetailResponse } from '../../types/student.types';
import StatusChip from '../common/StatusChip';
import { formatDate } from '../../utils/formatters';
import { BookOpen, AlertTriangle } from 'lucide-react';

interface StudentDetailPanelProps {
  student: StudentDetailResponse;
}

export const StudentDetailPanel: React.FC<StudentDetailPanelProps> = ({ student }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Información Personal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--outline-variant)'
      }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
            Nombre Completo
          </span>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--on-surface)', marginTop: '4px' }}>
            {student.fullName}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
            Código de Estudiante
          </span>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
            {student.studentCode}
          </p>
        </div>
      </div>

      {/* Grid: Aulas e Incidencias */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Aulas */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--on-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <BookOpen size={18} style={{ color: 'var(--primary)' }} />
            Aulas Inscritas
          </h4>
          {student.classes.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              Este estudiante no está inscrito en ninguna clase actualmente.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {student.classes.map((c) => (
                <li key={c.id} style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-default)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)'
                }}>
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Historial Incidencias */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--on-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertTriangle size={18} style={{ color: 'var(--status-critical)' }} />
            Historial de Incidencias
          </h4>
          {student.incidents.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              No se registran incidencias para este estudiante.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {student.incidents.map((incident) => (
                <div key={incident.id} style={{
                  padding: '16px',
                  backgroundColor: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)' }}>
                      {incident.title}
                    </h5>
                    <StatusChip status={incident.status} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                    {incident.schoolClass_name ? `Aula: ${incident.schoolClass_name}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPanel;
