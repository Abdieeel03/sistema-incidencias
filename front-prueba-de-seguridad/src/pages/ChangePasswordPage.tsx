import { useState, type FormEvent } from 'react';
import { userService } from '../services/user.service';
import { ResponseViewer } from '../components/ResponseViewer';
import type { FetchResult } from '../api/client';

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<FetchResult<any> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResult({
        ok: false,
        status: 0,
        data: null,
        duration: 0,
        error: 'Las contraseñas no coinciden',
      });
      return;
    }

    setLoading(true);
    setResult(null);
    const res = await userService.changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setResult(res);
    setLoading(false);

    if (res.ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔑 Cambiar Contraseña</h1>
        <p>Cambiar la contraseña del usuario autenticado</p>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        <div className="card-header">
          <h2>Cambiar Contraseña</h2>
          <code className="endpoint-badge">PATCH /api/users/me/change-password</code>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="current-password">Contraseña actual</label>
            <input
              id="current-password"
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Nueva contraseña</label>
            <input
              id="new-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Repetir nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={100}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
        <ResponseViewer result={result} loading={loading} />
      </div>
    </div>
  );
}
