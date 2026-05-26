import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Main Content Container */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 // Evita desborde flex en tablas
      }}>
        {/* Header Superior */}
        <Header />

        {/* Content Viewport */}
        <main style={{
          padding: '32px',
          flex: 1,
          backgroundColor: 'var(--background)',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
