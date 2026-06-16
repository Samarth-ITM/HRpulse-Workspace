import React from 'react';
import SalaryHistory from '../components/SalaryHistory';

export default function Salaries({ salaryHistory, employees, onUndoSalaryChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Salary Change Log</h2>
        <p className="text-muted">Monitor, audit, and roll back recent salary adjustments in the workspace.</p>
      </div>

      <SalaryHistory 
        salaryHistory={salaryHistory} 
        employees={employees} 
        onUndoChange={onUndoSalaryChange} 
      />
    </div>
  );
}
