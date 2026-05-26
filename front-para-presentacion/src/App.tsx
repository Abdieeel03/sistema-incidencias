import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Role } from './types/auth.types';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Coordinator Pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import UsersPage from './pages/coordinator/UsersPage';
import StudentsPage from './pages/coordinator/StudentsPage';
import ClassesPage from './pages/coordinator/ClassesPage';
import IncidentsPage from './pages/coordinator/IncidentsPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyClassesPage from './pages/teacher/MyClassesPage';
import MyIncidentsPage from './pages/teacher/MyIncidentsPage';
import CreateIncidentPage from './pages/teacher/CreateIncidentPage';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentIncidentsPage from './pages/parent/ParentIncidentsPage';

// Settings Page
import ProfilePage from './pages/settings/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      {/* Notificaciones globales */}
      <Toaster position="top-right" richColors closeButton />

      <Routes>
        {/* Rutas Públicas de Auth */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Rutas Privadas: COORDINADOR y ADMIN */}
        <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.COORDINADOR]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/coordinator" element={<CoordinatorDashboard />} />
            <Route path="/coordinator/users" element={<UsersPage />} />
            <Route path="/coordinator/students" element={<StudentsPage />} />
            <Route path="/coordinator/classes" element={<ClassesPage />} />
            <Route path="/coordinator/incidents" element={<IncidentsPage />} />
          </Route>
        </Route>

        {/* Rutas Privadas: PROFESOR */}
        <Route element={<ProtectedRoute roles={[Role.PROFESOR]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<MyClassesPage />} />
            <Route path="/teacher/incidents" element={<MyIncidentsPage />} />
            <Route path="/teacher/incidents/new" element={<CreateIncidentPage />} />
          </Route>
        </Route>

        {/* Rutas Privadas: PADRE */}
        <Route element={<ProtectedRoute roles={[Role.PADRE]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/incidents" element={<ParentIncidentsPage />} />
          </Route>
        </Route>

        {/* Rutas Compartidas (Todos los roles autenticados) */}
        <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.COORDINADOR, Role.PROFESOR, Role.PADRE]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/settings" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Redirecciones por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
