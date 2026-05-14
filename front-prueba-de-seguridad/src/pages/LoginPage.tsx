import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { ResponseViewer } from '../components/ResponseViewer';
import type { FetchResult } from '../api/client';
import type { AuthResponse } from '../types/auth.types';

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginResult, setLoginResult] = useState<FetchResult<AuthResponse> | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regResult, setRegResult] = useState<FetchResult<AuthResponse> | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage('');

    // Ejecutar fetch directo para capturar la respuesta raw
    const result = await authService.login({ username: loginUsername, password: loginPassword });
    setLoginResult(result);
    setLoginLoading(false);

    // Guardar en context si fue exitoso
    if (result.ok) {
      const authResult = await login({ username: loginUsername, password: loginPassword });
      setLoginMessage(authResult.message);
      if (authResult.success) {
        setTimeout(() => navigate('/'), 500);
      }
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage('');

    const result = await authService.register({
      name: regName,
      email: regEmail,
      dni: regDni,
      password: regPassword,
    });
    setRegResult(result);
    setRegLoading(false);

    if (result.ok) {
      const authResult = await register({
        name: regName,
        email: regEmail,
        dni: regDni,
        password: regPassword,
      });
      setRegMessage(authResult.message);
      if (authResult.success) {
        setTimeout(() => navigate('/'), 500);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>🏫 Sistema de Incidencias Escolares</h1>
        <p>API Security Tester — Frontend de prueba</p>
      </div>

      <div className="login-grid">
        {/* === LOGIN === */}
        <div className="card">
          <div className="card-header">
            <h2>🔐 Iniciar Sesión</h2>
            <code className="endpoint-badge">POST /api/auth/login</code>
          </div>
          <form onSubmit={handleLogin} className="form">
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="C12345678"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="mínimo 8 caracteres"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loginLoading}>
              {loginLoading ? 'Enviando...' : 'Iniciar Sesión'}
            </button>
            {loginMessage && <p className="form-message">{loginMessage}</p>}
          </form>
          <ResponseViewer result={loginResult} loading={loginLoading} />
        </div>

        {/* === REGISTER === */}
        <div className="card">
          <div className="card-header">
            <h2>📝 Registro (Coordinador)</h2>
            <code className="endpoint-badge">POST /api/auth/register</code>
          </div>
          <form onSubmit={handleRegister} className="form">
            <div className="form-group">
              <label htmlFor="reg-name">Nombre completo</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Juan Pérez"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="juan@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-dni">DNI (8 dígitos)</label>
              <input
                id="reg-dni"
                type="text"
                placeholder="12345678"
                value={regDni}
                onChange={(e) => setRegDni(e.target.value)}
                required
                pattern="\d{8}"
                maxLength={8}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="mínimo 8 caracteres"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={regLoading}>
              {regLoading ? 'Enviando...' : 'Registrarse'}
            </button>
            {regMessage && <p className="form-message">{regMessage}</p>}
          </form>
          <ResponseViewer result={regResult} loading={regLoading} />
        </div>
      </div>
    </div>
  );
}
