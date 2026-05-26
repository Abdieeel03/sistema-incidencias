import React, { useState, useEffect } from 'react';
import { SchoolClassResponse } from '../../types/class.types';
import { UserResponse } from '../../types/user.types';
import { StudentResponse } from '../../types/student.types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface ClassFormProps {
  classToEdit: SchoolClassResponse | null;
  teachers: UserResponse[];
  students: StudentResponse[];
  onSave: (data: { name: string; teacherId: number; studentIds: number[] }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classToEdit,
  teachers,
  students,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState<number | ''>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (classToEdit) {
      setName(classToEdit.name);
      setTeacherId(classToEdit.teacherId || '');
      setSelectedStudentIds(classToEdit.students.map(s => s.id));
    } else {
      setName('');
      setTeacherId('');
      setSelectedStudentIds([]);
    }
    setErrors({});
  }, [classToEdit]);

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'El nombre de la clase es obligatorio';
    if (!teacherId) tempErrors.teacherId = 'Debes asignar un Profesor';
    if (selectedStudentIds.length === 0) {
      tempErrors.students = 'Debes agregar al menos un estudiante';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name,
      teacherId: teacherId as number,
      studentIds: selectedStudentIds,
    });
  };

  const teacherOptions = teachers.map(t => ({
    value: t.id,
    label: `${t.name} (DNI: ${t.dni})`
  }));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input
        label="Nombre del Aula / Clase"
        placeholder="Ej: 5to B Secundaria"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        disabled={isLoading}
      />

      <Select
        label="Profesor Asignado"
        value={teacherId}
        onChange={(e) => setTeacherId(Number(e.target.value))}
        options={teacherOptions}
        placeholder="Seleccione un profesor"
        error={errors.teacherId}
        disabled={isLoading}
      />

      {/* Selector de Estudiantes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label">Alumnos Matriculados</label>
        
        <div style={{
          maxHeight: '180px',
          overflowY: 'auto',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-default)',
          padding: '8px 12px',
          backgroundColor: 'var(--surface-container-low)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {students.map((student) => {
            const isChecked = selectedStudentIds.includes(student.id);
            return (
              <label
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '4px',
                  color: isChecked ? 'var(--primary)' : 'var(--on-surface)',
                  fontWeight: isChecked ? 600 : 500
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleStudentToggle(student.id)}
                  disabled={isLoading}
                  style={{ cursor: 'pointer' }}
                />
                {student.firstName} {student.lastName} ({student.studentCode})
              </label>
            );
          })}
        </div>
        {errors.students && <span style={{
          fontSize: '12px',
          color: 'var(--error)',
          marginTop: '4px',
          display: 'block'
        }}>{errors.students}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {classToEdit ? 'Guardar Cambios' : 'Crear Aula'}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;
