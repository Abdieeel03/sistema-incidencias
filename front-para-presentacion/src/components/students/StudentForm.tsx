import React, { useState, useEffect } from 'react';
import { StudentResponse } from '../../types/student.types';
import { UserResponse } from '../../types/user.types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface StudentFormProps {
  studentToEdit: StudentResponse | null;
  parents: UserResponse[];
  onSave: (data: { firstName: string; lastName: string; dni: string; parentId: number }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  studentToEdit,
  parents,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (studentToEdit) {
      setFirstName(studentToEdit.firstName);
      setLastName(studentToEdit.lastName);
      setDni(studentToEdit.dni);
      setParentId(studentToEdit.parentId || '');
    } else {
      setFirstName('');
      setLastName('');
      setDni('');
      setParentId('');
    }
    setErrors({});
  }, [studentToEdit]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!firstName.trim()) tempErrors.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) tempErrors.lastName = 'El apellido es obligatorio';

    if (!dni.trim()) {
      tempErrors.dni = 'El DNI es obligatorio';
    } else if (dni.trim().length !== 8) {
      tempErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!parentId) {
      tempErrors.parentId = 'Debes asociar un Padre de Familia';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      firstName,
      lastName,
      dni,
      parentId: parentId as number,
    });
  };

  // Convertir lista de padres a formato de Select
  const parentOptions = parents.map(p => ({
    value: p.id,
    label: `${p.name} (DNI: ${p.dni})`
  }));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Input
          label="Nombres"
          placeholder="Nombres del estudiante"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          disabled={isLoading}
        />
        <Input
          label="Apellidos"
          placeholder="Apellidos del estudiante"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          disabled={isLoading}
        />
      </div>

      <Input
        label="DNI"
        placeholder="8 dígitos"
        value={dni}
        onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
        error={errors.dni}
        disabled={isLoading}
      />

      <Select
        label="Asociar Padre/Madre"
        value={parentId}
        onChange={(e) => setParentId(Number(e.target.value))}
        options={parentOptions}
        placeholder="Seleccione un padre de familia"
        error={errors.parentId}
        disabled={isLoading}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {studentToEdit ? 'Guardar Cambios' : 'Registrar Estudiante'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
