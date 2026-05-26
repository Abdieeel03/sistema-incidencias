import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'sonner';
import { User, KeyRound, ShieldAlert } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!oldPassword) tempErrors.oldPassword = 'La contraseña actual es obligatoria';
    
    if (!newPassword) {
      tempErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Las contraseñas nuevas no coinciden';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const res = await authApi.changePassword(oldPassword, newPassword, confirmPassword);
      if (res.success) {
        toast.success('Contraseña actualizada correctamente');
        // Resetear campos
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      }
    } catch (error) {
      // Interceptado
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      alignItems: 'start'
    }}>
      
      {/* Lado Izquierdo: Información del Perfil (Solo Lectura) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="headline-sm" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} style={{ color: 'var(--primary)' }} />
          Información del Usuario
        </h3>

        {/* Avatar y Rol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--outline-variant)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 800
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--on-surface)' }}>{user?.name}</h4>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              backgroundColor: 'var(--surface-container-high)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              marginTop: '4px'
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Detalles del Perfil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, textTransform: 'uppercase' }}>
              Nombre de Usuario
            </span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', marginTop: '2px' }}>
              {user?.username}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, textTransform: 'uppercase' }}>
              Correo Electrónico
            </span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', marginTop: '2px' }}>
              {user?.email}
            </p>
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-default)',
            border: '1px solid var(--outline-variant)',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            fontSize: '12px',
            color: 'var(--on-surface-variant)',
            lineHeight: 1.4,
            marginTop: '8px'
          }}>
            <ShieldAlert size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>
              La información personal es administrada y configurada por la coordinación de la institución. Si necesitas corregir tu correo o nombre, solicita el cambio con el coordinador.
            </span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Cambio de Contraseña */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="headline-sm" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <KeyRound size={20} style={{ color: 'var(--primary)' }} />
          Seguridad y Contraseña
        </h3>

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input
            label="Contraseña Actual"
            type="password"
            placeholder="Ingresa tu contraseña actual"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            error={errors.oldPassword}
            disabled={isSaving}
          />

          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="Min. 8 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            disabled={isSaving}
          />

          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            placeholder="Repite la nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isSaving}
          />

          <Button
            type="submit"
            isLoading={isSaving}
            style={{ width: '100%', marginTop: '16px', padding: '12px' }}
          >
            Actualizar Contraseña
          </Button>
        </form>
      </div>

    </div>
  );
};

export default ProfilePage;
