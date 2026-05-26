import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: 'var(--surface-container-lowest)',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--outline-variant)',
      gap: '16px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {icon && <div style={{ color: 'var(--outline)', marginBottom: '8px' }}>{icon}</div>}
      <h4 className="headline-sm" style={{ color: 'var(--on-surface)' }}>{title}</h4>
      <p className="body-sm" style={{ color: 'var(--on-surface-variant)', maxWidth: '320px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} style={{ marginTop: '8px' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
