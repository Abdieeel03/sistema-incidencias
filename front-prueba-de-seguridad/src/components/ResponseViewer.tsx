import type { FetchResult } from '../api/client';

interface ResponseViewerProps<T> {
  result: FetchResult<T> | null;
  loading?: boolean;
}

export function ResponseViewer<T>({ result, loading }: ResponseViewerProps<T>) {
  if (loading) {
    return (
      <div className="response-viewer">
        <div className="response-header">
          <span className="response-status loading">⏳ Enviando petición...</span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const getStatusClass = () => {
    if (result.status === 0) return 'error';
    if (result.status < 300) return 'success';
    if (result.status < 500) return 'warning';
    return 'error';
  };

  return (
    <div className="response-viewer">
      <div className="response-header">
        <span className={`response-status ${getStatusClass()}`}>
          {result.status === 0 ? '❌ Sin conexión' : `${result.status}`}
        </span>
        <span className="response-duration">{result.duration}ms</span>
        {result.ok && <span className="response-ok">✓ OK</span>}
      </div>
      {result.error && (
        <div className="response-error">
          ⚠️ {result.error}
        </div>
      )}
      <pre className="response-body">
        {JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  );
}
