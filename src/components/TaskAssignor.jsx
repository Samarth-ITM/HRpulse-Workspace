import React, { useState } from 'react';
import { Plus, ListTodo, CheckSquare } from 'lucide-react';

export default function TaskAssignor({ employees, tasks, onAddTask, onCompleteTask, taskNextIndex, setTaskNextIndex }) {
  const [taskName, setTaskName] = useState('');

  // Resolve employee name from employeeId
  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.id === Number(id));
    return emp ? emp.name : `Employee #${id}`;
  };

  // Derive available HR staff members from active tasks (no active task => status Available)
  const availableHR = employees.filter((emp) => {
    if (emp.department !== 'HR') return false;
    
    // An HR staff is busy if they have at least one task in progress
    const isBusy = tasks.some(
      (task) => task.assignedToId === emp.id && task.status !== 'Completed'
    );
    return !isBusy;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim() || availableHR.length === 0) return;

    // Determine assignee using round-robin logic among available HR staff
    const assigneeIndex = taskNextIndex % availableHR.length;
    const assignee = availableHR[assigneeIndex];

    onAddTask({
      title: taskName.trim(),
      assignedToId: assignee.id,
      status: 'In Progress',
      date: new Date().toISOString().split('T')[0]
    });

    // Update index for next round
    setTaskNextIndex(taskNextIndex + 1);
    setTaskName('');
  };

  const activeTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  // Next up for assignment
  const nextUpStaff = availableHR.length > 0 ? availableHR[taskNextIndex % availableHR.length] : null;

  return (
    <div className="split-pane">
      <div className="card">
        <h3 className="card-title">
          <ListTodo size={20} className="text-primary" /> HR Task Queue
        </h3>
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
          Performance reviews and appraisal forms distributed dynamically.
        </p>

        {availableHR.length > 0 && nextUpStaff ? (
          <div className="card" style={{ padding: 12, marginBottom: 16, border: '1px dashed var(--accent-primary)', backgroundColor: 'var(--accent-glow)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>
              Next Up for Assignment: {nextUpStaff.name} ({nextUpStaff.role})
            </span>
          </div>
        ) : (
          <div className="card" style={{ padding: 12, marginBottom: 16, border: '1px dashed var(--danger)', backgroundColor: 'var(--danger-glow)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>
              All HR staff are currently busy! Complete pending tasks to free up staff.
            </span>
          </div>
        )}

        {activeTasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>
            No active tasks.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTasks.map((task) => (
              <div key={task.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14 }}>{task.title}</h4>
                  <p className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
                    Assigned to: <strong>{getEmployeeName(task.assignedToId)}</strong> | Date: {task.date}
                  </p>
                </div>
                <button 
                  onClick={() => onCompleteTask(task.id)} 
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <CheckSquare size={14} /> Complete
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="card-title" style={{ marginTop: 32 }}>Completed Tasks</h3>
        {completedTasks.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13 }}>No completed tasks yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {completedTasks.slice(-5).reverse().map((task) => (
              <li 
                key={task.id} 
                style={{ 
                  fontSize: 13, 
                  padding: '8px 0', 
                  borderBottom: '1px solid var(--border-color)', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)' 
                }}
              >
                <span>{task.title} (Assigned to: {getEmployeeName(task.assignedToId)})</span>
                <span className="badge success">Done</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Assign HR Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskNameInput">Task Description</label>
            <input
              type="text"
              id="taskNameInput"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="form-control"
              placeholder="e.g. Conduct performance review for David"
              disabled={availableHR.length === 0}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 8 }}
            disabled={availableHR.length === 0}
          >
            <Plus size={16} /> Auto Assign Task
          </button>
        </form>
      </div>
    </div>
  );
}
