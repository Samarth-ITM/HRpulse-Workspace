import React from 'react';
import PermissionsHub from '../components/PermissionsHub';
import TaskAssignor from '../components/TaskAssignor';

export default function Settings({ 
  employees, 
  roles, 
  tasks, 
  onUpdateRoles, 
  onAddTask, 
  onCompleteTask, 
  taskNextIndex,
  setTaskNextIndex
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Roles & Tasks Hub</h2>
        <p className="text-muted">Manage system access levels and assign HR duties.</p>
      </div>

      <TaskAssignor 
        employees={employees} 
        tasks={tasks} 
        onAddTask={onAddTask} 
        onCompleteTask={onCompleteTask} 
        taskNextIndex={taskNextIndex}
        setTaskNextIndex={setTaskNextIndex}
      />

      <PermissionsHub 
        roles={roles} 
        onUpdateRoles={onUpdateRoles} 
      />
    </div>
  );
}
