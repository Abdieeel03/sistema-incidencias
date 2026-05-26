import React, { useState, useEffect } from 'react';
import { IncidentResponse } from '../../types/incident.types';
import { SchoolClassResponse } from '../../types/class.types';
import { StudentResponse } from '../../types/student.types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface IncidentFormProps {
  incidentToEdit: IncidentResponse | null;
  classes: SchoolClassResponse[];
  onSave: (data: { title: string; description: string; studentId?: number; classId?: number }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  incidentToEdit,
  classes,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [classId, setClassId] = useState<number | ''>('');
  const [studentId, setStudentId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentsOfClass, setStudentsOfClass] = useState<StudentResponse[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (incidentToEdit) {
      setTitle(incidentToEdit.title);
      setDescription(incidentToEdit.description);
      setClassId(incidentToEdit.classId);
      setStudentId(incidentToEdit.studentId);
    } else {
      setTitle('');
      setDescription('');
      setClassId('');
      setStudentId('');
      setStudentsOfClass([]);
    }
    setErrors({});
  }, [incidentToEdit]);

  // Filtrar estudiantes cuando cambie el aula seleccionada
  useEffect(() => {
    if (classId) {
      const selectedClass = classes.find(c => c.id === classId);
      if (selectedClass) {
        setStudentsOfClass(selectedClass.students as any[] || []);
      } else {
        setStudentsOfClass([]);
      }
      
      // Limpiar estudiante seleccionado si no pertenece a la nueva clase seleccionada
      if (incidentToEdit && incidentToEdit.classId === classId) {
        setStudentId(incidentToEdit.studentId);
      } else {
        setStudentId('');
      }
    } else {
      setStudentsOfClass([]);
      setStudentId('');
    }
  }, [classId, classes, incidentToEdit]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!classId) tempErrors.classId = 'El aula es obligatoria';
    if (!studentId) tempErrors.studentId = 'El estudiante es obligatorio';
    if (!title.trim()) tempErrors.title = 'El título de la incidencia es obligatorio';
    if (!description.trim()) tempErrors.description = 'La descripción es obligatoria';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: { title: string; description: string; studentId?: number; classId?: number } = {
      title,
      description,
    };

    // Solo enviar studentId y classId si estamos creando
    if (!incidentToEdit) {
      data.studentId = studentId as number;
      data.classId = classId as number;
    }

    onSave(data);
  };

  const classOptions = classes.map(c => ({
    value: c.id,
    label: c.name
  }));

  const studentOptions = studentsOfClass.map((s: any) => ({
    value: s.id,
    label: s.fullName ? `${s.fullName} (${s.studentCode})` : `${s.firstName} ${s.lastName} (${s.studentCode})`
  }));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Select
          label="Aula de Clase"
          value={classId}
          onChange={(e) => setClassId(Number(e.target.value))}
          options={classOptions}
          placeholder="Seleccione un aula"
          error={errors.classId}
          disabled={isLoading || !!incidentToEdit}
        />

        <Select
          label="Estudiante"
          value={studentId}
          onChange={(e) => setStudentId(Number(e.target.value))}
          options={studentOptions}
          placeholder={classId ? "Seleccione un alumno" : "Primero elija una clase"}
          error={errors.studentId}
          disabled={isLoading || !classId || !!incidentToEdit}
        />
      </div>

      <Input
        label="Título de la Incidencia"
        placeholder="Ej: Indisciplina en clase de ciencias"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        disabled={isLoading}
      />

      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label className="form-label">Descripción Detallada</label>
        <textarea
          className={`form-input ${errors.description ? 'error' : ''}`}
          placeholder="Describa detalladamente los hechos ocurridos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          rows={4}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
        {errors.description && <span style={{
          fontSize: '12px',
          color: 'var(--error)',
          marginTop: '4px',
          display: 'block'
        }}>{errors.description}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {incidentToEdit ? 'Guardar Cambios' : 'Registrar Incidencia'}
        </Button>
      </div>
    </form>
  );
};

export default IncidentForm;
