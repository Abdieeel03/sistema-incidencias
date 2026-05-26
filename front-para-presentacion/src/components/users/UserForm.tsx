import React, { useState, useEffect } from 'react';
import { UserResponse } from '../../types/user.types';
import { Role } from '../../types/auth.types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface UserFormProps {
  userToEdit: UserResponse | null;
  onSave: (data: { name: string; email: string; dni: string; password?: string; role?: Role }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  userToEdit,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.PROFESOR);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setDni(userToEdit.dni);
      setRole(userToEdit.role);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setDni('');
      setPassword('');
      setRole(Role.PROFESOR);
    }
    setErrors({});
  }, [userToEdit]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'El nombre es obligatorio';
    
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

    // Solo validar contraseña al crear un usuario nuevo
    if (!isEditing) {
      if (!password) {
        tempErrors.password = 'La contraseña es obligatoria';
      } else if (password.length < 8) {
        tempErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: { name: string; email: string; dni: string; password?: string; role?: Role } = {
      name,
      email,
      dni,
    };

    // Solo enviar el rol y la contraseña si estamos creando
    if (!isEditing) {
      data.role = role;
      data.password = password;
    }

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input
        label="Nombre Completo"
        placeholder="Nombre y Apellidos"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        disabled={isLoading}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
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

      {!isEditing && (
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
      )}

      {!isEditing && (
        <Select
          label="Rol del Usuario"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          options={[
            { value: Role.PROFESOR, label: 'Profesor' },
            { value: Role.PADRE, label: 'Padre de Familia' },
          ]}
          disabled={isLoading}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
