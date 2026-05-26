import React, { useEffect, useState } from 'react';
import { classesApi } from '../../api/classes.api';
import { usersApi } from '../../api/users.api';
import { studentsApi } from '../../api/students.api';
import { SchoolClassResponse } from '../../types/class.types';
import { UserResponse } from '../../types/user.types';
import { StudentResponse } from '../../types/student.types';
import { Role } from '../../types/auth.types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ClassForm from '../../components/classes/ClassForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { toast } from 'sonner';
import { Search, Plus, Trash2, Edit, RotateCcw, Users, GraduationCap } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [teachers, setTeachers] = useState<UserResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<SchoolClassResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<SchoolClassResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmaciones
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClassResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const loadData = async () => {
    try {
      const [classesRes, usersRes, studentsRes] = await Promise.all([
        showDeleted ? classesApi.getDeletedClasses() : classesApi.getClasses(),
        usersApi.getUsers(),
        studentsApi.getStudents(),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data.map(c => ({ ...c, isDeleted: showDeleted })));
      }
      if (usersRes.success) {
        setTeachers(usersRes.data.filter((u) => u.role === Role.PROFESOR));
      }
      if (studentsRes.success) {
        setStudents(studentsRes.data);
      }
    } catch (error) {
      console.error('Error al cargar datos de clases', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showDeleted]);

  // Filtrado
  useEffect(() => {
    let result = [...classes];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.teacherName || '').toLowerCase().includes(term)
      );
    }

    setFilteredClasses(result);
  }, [classes, search]);

  const handleSave = async (data: { name: string; teacherId: number; studentIds: number[] }) => {
    setIsSaving(true);
    try {
      if (classToEdit) {
        const res = await classesApi.updateClass(classToEdit.id, data);
        if (res.success) {
          toast.success('Aula actualizada exitosamente');
          loadData();
          setIsFormOpen(false);
        }
      } else {
        const res = await classesApi.createClass(data);
        if (res.success) {
          toast.success('Aula creada exitosamente');
          loadData();
          setIsFormOpen(false);
        }
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    setIsActionLoading(true);
    try {
      const res = await classesApi.deleteClass(selectedClass.id);
      if (res.success) {
        toast.success('Aula eliminada exitosamente');
        loadData();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedClass) return;
    setIsActionLoading(true);
    try {
      const res = await classesApi.restoreClass(selectedClass.id);
      if (res.success) {
        toast.success('Aula restaurada exitosamente');
        loadData();
        setIsRestoreOpen(false);
      }
    } catch (err) {
      // Interceptado
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Controles de Acción y Búsqueda */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Barra de Búsqueda */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px', minWidth: '300px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--outline)'
          }} />
          <input
            type="text"
            placeholder="Buscar por aula o profesor asignado..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Botón de Registro */}
        <Button onClick={() => { setClassToEdit(null); setIsFormOpen(true); }} style={{ gap: '8px' }}>
          <Plus size={18} />
          Nueva Aula
        </Button>
      </div>

      {/* Toggle de Soft Delete */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <label className="switch-container">
          <div className="switch">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            <span className="slider"></span>
          </div>
          Mostrar aulas eliminadas
        </label>
      </div>

      {/* Grid de Tarjetas de Aula */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {filteredClasses.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '48px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              No se encontraron aulas escolares creadas.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredClasses.map((schoolClass) => (
                <div
                  key={schoolClass.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    opacity: schoolClass.isDeleted ? 0.6 : 1,
                    position: 'relative'
                  }}
                >
                  {/* Status chip flotante */}
                  {schoolClass.isDeleted && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <StatusChip status="ELIMINADA" />
                    </div>
                  )}

                  {/* Detalle Aula */}
                  <div>
                    <h3 className="headline-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {schoolClass.name}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {/* Profesor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--on-surface)' }}>
                        <Users size={16} style={{ color: 'var(--outline)' }} />
                        <span>Profesor: <strong>{schoolClass.teacherName || 'No asignado'}</strong></span>
                      </div>

                      {/* Alumnos */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                        <GraduationCap size={16} style={{ color: 'var(--outline)' }} />
                        <span>Alumnos inscritos: <strong>{schoolClass.students?.length || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    borderTop: '1px solid var(--outline-variant)',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}>
                    {!schoolClass.isDeleted ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setClassToEdit(schoolClass);
                            setIsFormOpen(true);
                          }}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          <Edit size={14} />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedClass(schoolClass);
                            setIsDeleteOpen(true);
                          }}
                          style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--error)' }}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedClass(schoolClass);
                          setIsRestoreOpen(true);
                        }}
                        style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--primary)' }}
                      >
                        <RotateCcw size={14} />
                        Restaurar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Formulario Clase */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={classToEdit ? 'Editar Aula' : 'Nueva Aula'}
      >
        <ClassForm
          classToEdit={classToEdit}
          teachers={teachers}
          students={students}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Confirmar Eliminación */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Aula"
        message={`¿Estás seguro de que deseas eliminar la clase ${selectedClass?.name}? Los alumnos e incidencias asociadas seguirán en el sistema pero la clase ya no estará disponible.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={isActionLoading}
      />

      {/* Confirmar Restauración */}
      <ConfirmDialog
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestore}
        title="Restaurar Aula"
        message={`¿Deseas restaurar la clase ${selectedClass?.name}?`}
        confirmText="Restaurar"
        isLoading={isActionLoading}
      />

    </div>
  );
};

export default ClassesPage;
