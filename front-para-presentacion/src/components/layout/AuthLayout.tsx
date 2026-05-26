import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e5eeff 100%)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand/Header logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--on-primary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 40, 142, 0.2)'
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            marginTop: '8px'
          }}>
            Colegio San Ignacio
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--on-surface-variant)',
            fontWeight: 500
          }}>
            Sistema de Gestión de Incidencias
          </p>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
