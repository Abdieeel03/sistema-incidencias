import React from 'react';
import { IncidentStatus } from '../../types/incident.types';

interface StatusChipProps {
  status: IncidentStatus | 'ELIMINADA' | string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusClassAndText = () => {
    switch (status) {
      case IncidentStatus.NO_LEIDA:
        return { className: 'pending', text: 'No Leída' };
      case IncidentStatus.LEIDA:
        return { className: 'resolved', text: 'Leída' };
      case 'ELIMINADA':
      case 'DELETED':
        return { className: 'critical', text: 'Eliminado' };
      default:
        return { className: '', text: status };
    }
  };

  const { className, text } = getStatusClassAndText();

  return <span className={`status-chip ${className}`}>{text}</span>;
};
export default StatusChip;
