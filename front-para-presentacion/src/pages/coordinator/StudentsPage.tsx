import React, { useEffect, useState } from 'react';
import { studentsApi } from '../../api/students.api';
import { usersApi } from '../../api/users.api';
import { StudentResponse, StudentDetailResponse } from '../../types/student.types';
import { UserResponse } from '../../types/user.types';
import { Role } from '../../types/auth.types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/students/StudentForm';
import StudentDetailPanel from '../../components/students/StudentDetailPanel';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { toast } from 'sonner';
import { Search, Plus, Trash2, Edit, RotateCcw, Eye } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [parents, setParents] = useState<UserResponse[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Detalle alumno expandido
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<StudentDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Confirmaciones
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const loadData = async () => {
    try {
      const [studentsRes, usersRes] = await Promise.all([
        showDeleted ? studentsApi.getDeletedStudents() : studentsApi.getStudents(),
        usersApi.getUsers(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data.map(s => ({ ...s, isDeleted: showDeleted })));
      }
      if (usersRes.success) {
        // Filtrar solo padres activos para asociar
        setParents(usersRes.data.filter((u) => u.role === Role.PADRE));
      }
    } catch (error) {
      console.error('Error al cargar datos de estudiantes/padres', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showDeleted]);

  // Filtrado
  useEffect(() => {
    let result = [...students];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.studentCode.toLowerCase().includes(term) ||
          s.dni.includes(term) ||
          (s.parentName || '').toLowerCase().includes(term)
      );
    }

    setFilteredStudents(result);
  }, [students, search]);

  const handleSave = async (data: { firstName: string; lastName: string; dni: string; parentId: number }) => {
    setIsSaving(true);
    try {
      if (studentToEdit) {
        const res = await studentsApi.updateStudent(studentToEdit.id, data);
        if (res.success) {
          toast.success('Estudiante actualizado exitosamente');
          loadData();
          setIsFormOpen(false);
        }
      } else {
        const res = await studentsApi.createStudent(data);
        if (res.success) {
          toast.success('Estudiante registrado con éxito. Se autogeneró su código único.');
          loadData();
          setIsFormOpen(false);
        }
      }
    } catch (err) {
      // Manejado por interceptor
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsActionLoading(true);
    try {
      const res = await studentsApi.deleteStudent(selectedStudent.id);
      if (res.success) {
        toast.success('Registro de estudiante deshabilitado (soft-deleted)');
        loadData();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      // Manejado por interceptor
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedStudent) return;
    setIsActionLoading(true);
    try {
      const res = await studentsApi.restoreStudent(selectedStudent.id);
      if (res.success) {
        toast.success('Estudiante restaurado exitosamente');
        loadData();
        setIsRestoreOpen(false);
      }
    } catch (err) {
      // Manejado por interceptor
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewDetails = async (studentId: number) => {
    setIsDetailLoading(true);
    setIsDetailOpen(true);
    try {
      const res = await studentsApi.getStudentDetails(studentId);
      if (res.success) {
        setDetailStudent(res.data);
      }
    } catch (error) {
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
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
            placeholder="Buscar por código, nombres, DNI o padre..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Botón de Registro */}
        <Button onClick={() => { setStudentToEdit(null); setIsFormOpen(true); }} style={{ gap: '8px' }}>
          <Plus size={18} />
          Nuevo Estudiante
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
          Mostrar estudiantes retirados
        </label>
      </div>

      {/* Tabla de Alumnos */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código Único</th>
                <th>Nombre del Estudiante</th>
                <th>DNI</th>
                <th>Padre / Apoderado</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                    No se encontraron registros de estudiantes.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} style={{ opacity: student.isDeleted ? 0.6 : 1 }}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{student.studentCode}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
                        {student.firstName} {student.lastName}
                      </span>
                    </td>
                    <td>{student.dni}</td>
                    <td>{student.parentName || '—'}</td>
                    <td>
                      <StatusChip status={student.isDeleted ? 'ELIMINADA' : 'ACTIVO'} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleViewDetails(student.id)}
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {!student.isDeleted ? (
                          <>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setStudentToEdit(student);
                                setIsFormOpen(true);
                              }}
                              title="Editar estudiante"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDeleteOpen(true);
                              }}
                              title="Deshabilitar estudiante"
                              style={{ color: 'var(--error)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-ghost"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsRestoreOpen(true);
                            }}
                            title="Restaurar estudiante"
                            style={{ color: 'var(--primary)' }}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Formulario Registro / Edición */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={studentToEdit ? 'Editar Estudiante' : 'Registrar Estudiante'}
      >
        <StudentForm
          studentToEdit={studentToEdit}
          parents={parents}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Modal: Detalle del Estudiante */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha del Estudiante"
        size="lg"
      >
        {isDetailLoading || !detailStudent ? (
          <LoadingSpinner />
        ) : (
          <StudentDetailPanel student={detailStudent} />
        )}
      </Modal>

      {/* Confirmar Eliminación */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Deshabilitar Estudiante"
        message={`¿Estás seguro de que deseas retirar del sistema al estudiante ${selectedStudent?.firstName} ${selectedStudent?.lastName}?`}
        confirmText="Deshabilitar"
        variant="danger"
        isLoading={isActionLoading}
      />

      {/* Confirmar Restauración */}
      <ConfirmDialog
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestore}
        title="Restaurar Estudiante"
        message={`¿Deseas restaurar la matrícula del estudiante ${selectedStudent?.firstName} ${selectedStudent?.lastName}?`}
        confirmText="Restaurar"
        isLoading={isActionLoading}
      />

    </div>
  );
};

export default StudentsPage;
