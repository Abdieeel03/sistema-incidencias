import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import { UserResponse } from '../../types/user.types';
import { Role } from '../../types/auth.types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/users/UserForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { toast } from 'sonner';
import { Search, Plus, Trash2, Edit, RotateCcw } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Borrar / Restaurar Confirmaciones
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role.PROFESOR | Role.PADRE>('ALL');
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchUsers = async (deleted = false) => {
    setIsLoading(true);
    try {
      const response = deleted ? await usersApi.getDeletedUsers() : await usersApi.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error al listar usuarios', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(showDeleted);
  }, [showDeleted]);

  // Filtrado de la lista en memoria
  useEffect(() => {
    let result = users;

    // Role filter
    if (roleFilter !== 'ALL') {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.dni.includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(result);
  }, [users, search, roleFilter]);

  const handleSave = async (data: { name: string; email: string; dni: string; password?: string; role?: Role }) => {
    setIsSaving(true);
    try {
      if (userToEdit) {
        // Actualizar via coordinador
        const res = await usersApi.coordinatorUpdateUser(userToEdit.id, {
          dni: data.dni,
          role: data.role || userToEdit.role,
        });
        if (res.success) {
          toast.success('Usuario actualizado exitosamente');
          fetchUsers(showDeleted);
          setIsFormOpen(false);
        }
      } else {
        // Crear
        const res = await usersApi.createUser({
          name: data.name,
          email: data.email,
          dni: data.dni,
          password: data.password!,
          role: data.role || Role.PROFESOR,
        });
        if (res.success) {
          toast.success('Usuario creado exitosamente.');
          fetchUsers(showDeleted);
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
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const res = await usersApi.deleteUser(selectedUser.id);
      if (res.success) {
        toast.success('Usuario eliminado exitosamente');
        fetchUsers(showDeleted);
        setIsDeleteOpen(false);
      }
    } catch (err) {
      // Manejado por interceptor
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const res = await usersApi.restoreUser(selectedUser.id);
      if (res.success) {
        toast.success('Usuario restaurado exitosamente');
        fetchUsers(showDeleted);
        setIsRestoreOpen(false);
      }
    } catch (err) {
      // Manejado por interceptor
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
        {/* Barra de Búsqueda y Filtro */}
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--outline)'
            }} />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario, DNI o correo..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <select
            className="form-input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            style={{ width: '180px' }}
          >
            <option value="ALL">Todos los Roles</option>
            <option value={Role.PROFESOR}>Profesores</option>
            <option value={Role.PADRE}>Padres de Familia</option>
          </select>
        </div>

        {/* Botón de Agregar */}
        <Button onClick={() => { setUserToEdit(null); setIsFormOpen(true); }} style={{ gap: '8px' }}>
          <Plus size={18} />
          Nuevo Usuario
        </Button>
      </div>

      {/* Controles de Soft Delete Toggle */}
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
          Mostrar usuarios eliminados
        </label>
      </div>

      {/* Tabla de Usuarios */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>DNI</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ opacity: showDeleted ? 0.6 : 1 }}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{user.name}</span>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.dni}</td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: user.role === Role.PROFESOR ? 'var(--primary)' : 'var(--secondary)'
                      }}>
                        {user.role === Role.PROFESOR ? 'Profesor' : 'Padre'}
                      </span>
                    </td>
                    <td>
                      <StatusChip status={showDeleted ? 'ELIMINADA' : 'ACTIVO'} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {!showDeleted ? (
                          <>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setUserToEdit(user);
                                setIsFormOpen(true);
                              }}
                              title="Editar usuario"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteOpen(true);
                              }}
                              title="Eliminar usuario"
                              style={{ color: 'var(--error)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-ghost"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsRestoreOpen(true);
                            }}
                            title="Restaurar usuario"
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

      {/* Formulario Modal (Crear / Editar) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UserForm
          userToEdit={userToEdit}
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
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar al usuario ${selectedUser?.name}? Sus datos y acceso quedarán deshabilitados.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={isActionLoading}
      />

      {/* Confirmar Restauración */}
      <ConfirmDialog
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestore}
        title="Confirmar Restauración"
        message={`¿Deseas restaurar la cuenta del usuario ${selectedUser?.name}? Se reactivará su acceso al portal.`}
        confirmText="Restaurar"
        isLoading={isActionLoading}
      />

    </div>
  );
};

export default UsersPage;
