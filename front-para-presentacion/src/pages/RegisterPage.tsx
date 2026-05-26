import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'sonner';
import { Role } from '../types/auth.types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'El nombre completo es obligatorio';
    
    if (!email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'El formato del correo es inválido';
    }

    if (!dni.trim()) {
      tempErrors.dni = 'El DNI es obligatorio';
    } else if (dni.trim().length !== 8) {
      tempErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!password) {
      tempErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      tempErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authApi.register({
        name,
        email,
        dni,
        password,
      });

      if (response.success && response.parsed) {
        const { accessToken, user } = response.parsed;
        setAuth(accessToken, user);
        toast.success('¡Registro completado e inicio de sesión exitoso!');

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
        toast.error(response.message || 'Error al registrarse');
      }
    } catch (error) {
      // Manejado por interceptor de Axios
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <h3 className="headline-md" style={{
        textAlign: 'center',
        color: 'var(--on-surface)',
        marginBottom: '12px'
      }}>
        Crear Cuenta
      </h3>

      <Input
        label="Nombre Completo"
        placeholder="Nombre y Apellidos"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        disabled={isLoading}
      />

      <Input
        label="DNI"
        placeholder="8 dígitos"
        value={dni}
        onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
        maxLength={8}
        error={errors.dni}
        disabled={isLoading}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={isLoading}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
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
        Registrarse
      </Button>

      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--on-surface-variant)'
      }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
          Inicia Sesión
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
