import React, { useEffect, useState } from 'react';
import { classesApi } from '../../api/classes.api';
import { studentsApi } from '../../api/students.api';
import { SchoolClassResponse } from '../../types/class.types';
import { StudentResponse, StudentDetailResponse } from '../../types/student.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StudentDetailPanel from '../../components/students/StudentDetailPanel';
import { School, GraduationCap, ChevronRight, Eye } from 'lucide-react';

export const MyClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [selectedClass, setSelectedClass] = useState<SchoolClassResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Detalle de alumno
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<StudentDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await classesApi.getMyClasses();
        if (res.success) {
          setClasses(res.data);
          if (res.data.length > 0) {
            setSelectedClass(res.data[0]); // Seleccionar la primera por defecto
          }
        }
      } catch (error) {
        console.error('Error al cargar mis clases', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyClasses();
  }, []);

  const handleViewStudentDetails = async (studentId: number) => {
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {classes.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '48px' }}>
          No tienes aulas asignadas en este periodo escolar.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Columna Izquierda: Listado de aulas asignadas */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
              Mis Aulas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classes.map((c) => {
                const isSelected = selectedClass?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 'var(--radius-default)',
                      border: '1px solid var(--outline-variant)',
                      backgroundColor: isSelected ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <School size={20} style={{ color: isSelected ? 'var(--primary)' : 'var(--outline)' }} />
                      <div>
                        <strong style={{ fontSize: '14px', color: isSelected ? 'var(--primary)' : 'var(--on-surface)' }}>
                          {c.name}
                        </strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                          {c.students?.length || 0} estudiantes
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: isSelected ? 'var(--primary)' : 'var(--outline)' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Alumnos de la clase seleccionada */}
          {selectedClass && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
                Alumnos en {selectedClass.name}
              </h3>

              {(!selectedClass.students || selectedClass.students.length === 0) ? (
                <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontStyle: 'italic', padding: '24px' }}>
                  No hay alumnos registrados en esta clase.
                </p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre Completo</th>
                        <th style={{ textAlign: 'right' }}>Ficha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClass.students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <strong style={{ color: 'var(--primary)' }}>{student.studentCode}</strong>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
                              {student.fullName}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-ghost"
                              onClick={() => handleViewStudentDetails(student.id)}
                              title="Ver ficha del estudiante"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal: Detalle de Alumno */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha del Alumno"
        size="lg"
      >
        {isDetailLoading || !detailStudent ? (
          <LoadingSpinner />
        ) : (
          <StudentDetailPanel student={detailStudent} />
        )}
      </Modal>

    </div>
  );
};

export default MyClassesPage;
// Estilos adicionales
