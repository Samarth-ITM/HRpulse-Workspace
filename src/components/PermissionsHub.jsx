import React, { useState } from 'react';
import { Shield, ShieldAlert, Plus, Trash } from 'lucide-react';

export default function PermissionsHub({ roles, onUpdateRoles }) {
  const [newPermission, setNewPermission] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]?.role || '');

  const handleAddPermission = (e) => {
    e.preventDefault();
    if (!newPermission.trim() || !selectedRole) return;

    const updatedRoles = roles.map(r => {
      if (r.role === selectedRole) {
        // Avoid duplicates
        if (r.permissions.includes(newPermission.trim())) return r;
        return {
          ...r,
          permissions: [...r.permissions, newPermission.trim()]
        };
      }
      return r;
    });

    onUpdateRoles(updatedRoles);
    setNewPermission('');
  };

  const handleRemovePermission = (roleName, permission) => {
    const updatedRoles = roles.map(r => {
      if (r.role === roleName) {
        return {
          ...r,
          permissions: r.permissions.filter(p => p !== permission)
        };
      }
      return r;
    });
    onUpdateRoles(updatedRoles);
  };

  return (
    <div className="split-pane">
      <div className="card">
        <h3 className="card-title">
          <Shield size={20} className="text-primary" /> Role Access Matrix
        </h3>
        <p className="text-muted" style={{ marginBottom: 20, fontSize: 14 }}>
          Security rules and access levels defined for different employee roles.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roles.map((r) => (
            <div key={r.role} className="card" style={{ padding: 16, backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 12, width: '100%' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <ShieldAlert size={16} className="text-primary" /> {r.role}
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {r.permissions.length === 0 ? (
                  <span className="text-muted" style={{ fontSize: 13 }}>No permissions assigned.</span>
                ) : (
                  r.permissions.map((perm) => (
                    <span 
                      key={perm} 
                      className="badge primary" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingRight: 6 }}
                    >
                      {perm}
                      <Trash 
                        size={12} 
                        style={{ cursor: 'pointer', color: 'var(--danger)' }} 
                        onClick={() => handleRemovePermission(r.role, perm)} 
                      />
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Assign New Permission</h3>
        <form onSubmit={handleAddPermission}>
          <div className="form-group">
            <label htmlFor="roleSelect">Target Role</label>
            <select
              id="roleSelect"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-control"
              required
            >
              {roles.map(r => (
                <option key={r.role} value={r.role}>
                  {r.role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="permissionInput">Permission Name</label>
            <input
              type="text"
              id="permissionInput"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              className="form-control"
              placeholder="e.g. viewSalaryHistory, terminateEmployee"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            <Plus size={16} /> Add Permission
          </button>
        </form>
      </div>
    </div>
  );
}
