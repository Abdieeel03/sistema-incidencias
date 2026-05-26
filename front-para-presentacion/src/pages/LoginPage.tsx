import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'sonner';
import { Role } from '../types/auth.types';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors: { username?: string; password?: string } = {};
    if (!username.trim()) tempErrors.username = 'El usuario es obligatorio';
    if (!password) tempErrors.password = 'La contraseña es obligatoria';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authApi.login({ username, password });
      if (response.success && response.parsed) {
        const { accessToken, user } = response.parsed;
        setAuth(accessToken, user);
        toast.success(`¡Bienvenido de nuevo, ${user.name}!`);

        // Redirigir según el rol del usuario
        switch (user.role) {
          case Role.ADMIN:
          case Role.COORDINADOR:
            navigate('/coordinator');
            break;
          case Role.PROFESOR:
            navigate('/teacher');
            break;
          case Role.PADRE:
            navigate('/parent');
            break;
          default:
            navigate('/login');
        }
      } else {
        toast.error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      // Axios interceptor handles generic errors, we just turn off loading
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h3 className="headline-md" style={{
        textAlign: 'center',
        color: 'var(--on-surface)',
        marginBottom: '16px'
      }}>
        Iniciar Sesión
      </h3>

      <Input
        label="Usuario"
        placeholder="Ingresa tu nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        disabled={isLoading}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={isLoading}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        style={{ width: '100%', marginTop: '16px', padding: '12px' }}
      >
        Ingresar al Portal
      </Button>

      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--on-surface-variant)'
      }}>
        ¿Aún no tienes cuenta?{' '}
        <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
          Regístrate
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
