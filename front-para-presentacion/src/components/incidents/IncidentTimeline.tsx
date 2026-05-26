import React from 'react';
import { IncidentResponse, IncidentStatus } from '../../types/incident.types';
import StatusChip from '../common/StatusChip';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { Eye, Clock, CheckCircle } from 'lucide-react';

interface IncidentTimelineProps {
  incidents: IncidentResponse[];
  onMarkAsRead?: (id: number) => Promise<void>;
  isActionLoading?: number | null; // ID de la incidencia que se está procesando
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidents,
  onMarkAsRead,
  isActionLoading = null,
}) => {
  if (incidents.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '32px',
        color: 'var(--on-surface-variant)',
        backgroundColor: 'var(--surface-container-low)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--outline-variant)',
        fontSize: '14px'
      }}>
        Este estudiante no tiene incidencias reportadas.
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      paddingLeft: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Línea vertical de fondo */}
      <div style={{
        position: 'absolute',
        top: '8px',
        bottom: '8px',
        left: '11px',
        width: '2px',
        backgroundColor: 'var(--outline-variant)'
      }}></div>

      {incidents.map((incident) => {
        const isPending = incident.status === IncidentStatus.NO_LEIDA;
        const isLoading = isActionLoading === incident.id;

        return (
          <div key={incident.id} style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Dot indicador en la línea */}
            <div style={{
              position: 'absolute',
              left: '-28px',
              top: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: isPending ? 'var(--status-pending)' : 'var(--status-resolved)',
              border: '4px solid var(--surface-container-lowest)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 10
            }}></div>

            {/* Tarjeta de Contenido */}
            <div className="card" style={{
              padding: '20px',
              borderLeft: isPending ? '4px solid var(--status-pending)' : '4px solid var(--status-resolved)',
              backgroundColor: 'var(--surface-container-lowest)',
              transition: 'all var(--transition-fast)'
            }}>
              {/* Encabezado */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h4 className="body-lg" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                    {incident.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--on-surface-variant)',
                    marginTop: '4px'
                  }}>
                    <span>Aula: <strong>{incident.className}</strong></span>
                    <span>•</span>
                    <span>Reportado por: <strong>{incident.teacherName}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusChip status={incident.status} />
                </div>
              </div>

              {/* Descripción */}
              <p className="body-sm" style={{
                color: 'var(--on-surface-variant)',
                margin: '12px 0 16px 0',
                lineHeight: 1.6,
                backgroundColor: 'var(--surface-container-low)',
                padding: '12px var(--space-md)',
                borderRadius: 'var(--radius-default)',
                border: '1px solid rgba(229, 238, 255, 0.5)'
              }}>
                {incident.description}
              </p>

              {/* Pie de la tarjeta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <span style={{
                  fontSize: '11px',
                  color: 'var(--outline)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={12} />
                  {formatDate(incident.incidentDate)}
                </span>

                {isPending && onMarkAsRead && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onMarkAsRead(incident.id)}
                    isLoading={isLoading}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      gap: '6px'
                    }}
                  >
                    <Eye size={14} />
                    Marcar como Leída
                  </Button>
                )}
                
                {!isPending && (
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--status-resolved)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}>
                    <CheckCircle size={14} />
                    Leída
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IncidentTimeline;
// Estilo clave de animación y transición
