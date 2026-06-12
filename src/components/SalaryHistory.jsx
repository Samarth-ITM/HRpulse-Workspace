import React from 'react';
import { RotateCcw, DollarSign, Calendar, User } from 'lucide-react';

export default function SalaryHistory({ salaryHistory, employees, onUndoChange }) {
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === Number(id));
    return emp ? emp.name : `Employee #${id}`;
  };

  // Reversing for display so newest changes appear at the top
  const sortedHistory = [...salaryHistory].reverse();

  // The globally latest change is the last item in the original salaryHistory array
  const latestChangeId = salaryHistory.length > 0 ? salaryHistory[salaryHistory.length - 1].id : null;

  return (
    <div className="card">
      <h3 className="card-title">
        <DollarSign size={20} className="text-primary" /> Salary Change Log
      </h3>
      {sortedHistory.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>
          No salary modifications recorded.
        </p>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Old Salary</th>
                <th>New Salary</th>
                <th>Difference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((hist) => {
                const isLatest = hist.id === latestChangeId;
                const difference = hist.newSalary - hist.oldSalary;
                const diffColor = difference >= 0 ? 'var(--success)' : 'var(--danger)';
                const diffSign = difference >= 0 ? '+' : '';

                return (
                  <tr key={hist.id} style={isLatest ? { backgroundColor: 'rgba(99, 102, 241, 0.05)' } : {}}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Calendar size={14} className="text-muted" />
                        {hist.date}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} className="text-muted" />
                        {getEmployeeName(hist.employeeId)}
                      </span>
                    </td>
                    <td>${hist.oldSalary.toLocaleString()}</td>
                    <td><strong>${hist.newSalary.toLocaleString()}</strong></td>
                    <td style={{ color: diffColor, fontWeight: 600 }}>
                      {diffSign}${difference.toLocaleString()}
                    </td>
                    <td>
                      {isLatest ? (
                        <button 
                          onClick={() => onUndoChange(hist)} 
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <RotateCcw size={13} /> Undo Change
                        </button>
                      ) : (
                        <span className="text-muted" style={{ fontSize: 12 }}>Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
