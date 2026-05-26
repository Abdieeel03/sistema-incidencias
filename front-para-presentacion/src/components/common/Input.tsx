import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <input
          ref={ref}
          className={`form-input ${error ? 'error' : ''} ${className}`}
          {...props}
        />
        {error && <span style={{
          fontSize: '12px',
          color: 'var(--error)',
          marginTop: '4px',
          display: 'block'
        }}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
