import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../api/classes.api';
import { incidentsApi } from '../../api/incidents.api';
import { SchoolClassResponse } from '../../types/class.types';
import IncidentForm from '../../components/incidents/IncidentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export const CreateIncidentPage: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClassResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classesApi.getMyClasses();
        if (res.success) {
          // Filtrar aulas activas que tengan estudiantes matriculados
          setClasses(res.data.filter(c => c.students?.length > 0));
        }
      } catch (error) {
        console.error('Error al cargar aulas del docente', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSave = async (data: { title: string; description: string; studentId?: number; classId?: number }) => {
    if (!data.studentId || !data.classId) return;
    setIsSaving(true);
    try {
      const res = await incidentsApi.createIncident({
        title: data.title,
        description: data.description,
        studentId: data.studentId,
        classId: data.classId,
      });

      if (res.success) {
        toast.success('Incidencia reportada con éxito y notificada al apoderado.');
        navigate('/teacher/incidents');
      }
    } catch (error) {
      // Interceptado por Axios
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {classes.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '48px 24px',
          backgroundColor: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--outline-variant)',
          textAlign: 'center'
        }}>
          <AlertCircle size={40} style={{ color: 'var(--status-pending)' }} />
          <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>No tienes aulas con alumnos</h3>
          <p className="body-sm" style={{ color: 'var(--on-surface-variant)', maxWidth: '320px' }}>
            Para reportar una incidencia necesitas tener aulas asignadas que contengan alumnos inscritos.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/teacher')}
            style={{ marginTop: '8px' }}
          >
            Volver al Dashboard
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px' }}>
          <h2 className="headline-sm" style={{ color: 'var(--on-surface)', marginBottom: '24px' }}>
            Reportar Nueva Incidencia de Convivencia
          </h2>
          <IncidentForm
            incidentToEdit={null}
            classes={classes}
            onSave={handleSave}
            onCancel={() => navigate('/teacher/incidents')}
            isLoading={isSaving}
          />
        </div>
      )}

    </div>
  );
};

export default CreateIncidentPage;
