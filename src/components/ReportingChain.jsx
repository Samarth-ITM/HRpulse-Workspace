import React, { useState } from 'react';
import { ArrowRight, Network } from 'lucide-react';

export default function ReportingChain({ employees }) {
  const [selectedId, setSelectedId] = useState('');

  // Simple parent traversal logic to track reporting hierarchy up to CEO
  const getReportingChain = (empId) => {
    if (!empId) return [];
    
    const chain = [];
    const visited = new Set();
    let current = employees.find(e => e.id === Number(empId));
    
    while (current && !visited.has(current.id)) {
      chain.push(current);
      visited.add(current.id);
      if (!current.managerId) break;
      
      const manager = employees.find(e => e.id === current.managerId);
      current = manager;
    }
    
    return chain; // [Employee, Manager, Director, CEO]
  };

  const chain = getReportingChain(selectedId);

  return (
    <div className="card">
      <h3 className="card-title">
        <Network size={20} className="text-primary" /> Reporting Chain Tracker
      </h3>
      <p className="text-muted" style={{ marginBottom: 20, fontSize: 14 }}>
        Find the reporting hierarchy and chain of command from any employee up to the CEO.
      </p>

      <div className="form-group" style={{ maxWidth: 400, marginBottom: 24 }}>
        <label htmlFor="employeeChainSelect">Select Employee</label>
        <select
          id="employeeChainSelect"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="form-control"
        >
          <option value="">-- Choose Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.department} - {emp.role})
            </option>
          ))}
        </select>
      </div>

      {chain.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600 }}>Path to CEO:</h4>
          <div className="path-container">
            {chain.map((emp, index) => (
              <React.Fragment key={emp.id}>
                {index > 0 && <ArrowRight className="path-arrow" />}
                <div className="path-node" style={index === 0 ? { borderColor: 'var(--accent-primary)', backgroundColor: 'var(--accent-glow)' } : {}}>
                  <span className="path-node-name">{emp.name}</span>
                  <span className="path-node-role">{emp.role}</span>
                  <span className="path-node-dept" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.department}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            Total Management Steps: <strong>{chain.length - 1}</strong>
          </p>
        </div>
      ) : (
        <p className="text-muted" style={{ padding: '12px 0' }}>
          Select an employee above to calculate their reporting chain.
        </p>
      )}
    </div>
  );
}
