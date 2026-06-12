import React, { useState } from 'react';
import { Calendar, ArrowUpDown } from 'lucide-react';

export default function EmployeeTable({ employees, onUpdateSalary }) {
  const [editingId, setEditingId] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    if (aVal === undefined || aVal === null) aVal = 0;
    if (bVal === undefined || bVal === null) bVal = 0;

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const startEditing = (emp) => {
    setEditingId(emp.id);
    setNewSalary(emp.salary);
  };

  const saveSalary = (empId) => {
    const cleanSalary = String(newSalary).replace(/[$,]/g, '').trim();
    const parsedSalary = Number(cleanSalary);
    
    // Strict input validation
    if (newSalary === '' || isNaN(parsedSalary)) {
      alert("Invalid salary: Please enter a valid number.");
      return;
    }
    if (parsedSalary <= 0) {
      alert("Invalid salary: Salary must be a positive number.");
      return;
    }
    if (!Number.isInteger(parsedSalary)) {
      alert("Invalid salary: Salary must be an integer.");
      return;
    }

    onUpdateSalary(empId, parsedSalary);
    setEditingId(null);
  };

  return (
    <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
              ID <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
              Department <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
              Role <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>
              Salary <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th onClick={() => handleSort('joinDate')} style={{ cursor: 'pointer' }}>
              Join Date <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>#{emp.id}</td>
              <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</td>
              <td>
                <span className={`badge ${
                  emp.department === 'Engineering' ? 'primary' :
                  emp.department === 'HR' ? 'success' :
                  emp.department === 'Finance' ? 'warning' : 'danger'
                }`}>
                  {emp.department}
                </span>
              </td>
              <td>{emp.role}</td>
              <td>
                {editingId === emp.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>$</span>
                    <input
                      type="text"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="form-control"
                      style={{ width: 100, padding: '4px 8px', fontSize: 13 }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <strong>${emp.salary ? Number(emp.salary).toLocaleString() : '0'}</strong>
                )}
              </td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <Calendar size={14} className="text-muted" />
                  {emp.joinDate || 'N/A'}
                </span>
              </td>
              <td>
                {editingId === emp.id ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => saveSalary(emp.id)} className="btn btn-primary btn-sm">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startEditing(emp)} className="btn btn-secondary btn-sm">
                    Update Salary
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
