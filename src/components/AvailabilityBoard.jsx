import React from 'react';
import { ToggleLeft, User } from 'lucide-react';

export default function AvailabilityBoard({ employees, tasks }) {
  // Filter all HR employees
  const hrStaff = employees.filter(e => e.department === 'HR');

  return (
    <div className="card">
      <h3 className="card-title">
        <ToggleLeft size={20} className="text-primary" /> HR Availability Board
      </h3>
      <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
        Real-time availability status derived dynamically from active task assignments.
      </p>

      <div className="table-container">
        <table className="custom-table" style={{ fontSize: 14 }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Active Tasks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {hrStaff.map((emp) => {
              // Derived busy/available operational status from the current tasks state
              const activeTasksCount = tasks.filter(
                t => t.assignedToId === emp.id && t.status !== 'Completed'
              ).length;
              const isAvailable = activeTasksCount === 0;

              return (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} className="text-muted" />
                      {emp.name}
                    </span>
                  </td>
                  <td>{emp.department}</td>
                  <td>
                    <strong>{activeTasksCount}</strong> active
                  </td>
                  <td>
                    {isAvailable ? (
                      <span className="badge success">Available</span>
                    ) : (
                      <span className="badge danger">Busy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
