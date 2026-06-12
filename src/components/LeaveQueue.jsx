import React, { useState } from 'react';
import { User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function LeaveQueue({ leaveRequests, employees, onSubmitRequest, onProcessRequest }) {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Vacation');

  // Map employee name for rendering
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === Number(id));
    return emp ? emp.name : `Employee #${id}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) return;
    
    onSubmitRequest({
      employeeId: Number(employeeId),
      type: leaveType,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    });
    
    setEmployeeId('');
  };

  // Only pending requests are in the queue for processing
  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const processedRequests = leaveRequests.filter(req => req.status !== 'Pending');

  return (
    <div className="split-pane">
      <div className="card">
        <h3 className="card-title">
          <Clock size={20} className="text-primary" /> Active Queue (Pending)
        </h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Strict First-In-First-Out (FIFO) queue. Only the front-of-queue request can be processed.
        </p>

        {pendingRequests.length === 0 ? (
          <p className="text-muted" style={{ padding: '24px 0', textAlign: 'center' }}>
            No pending time-off requests.
          </p>
        ) : (
          <div className="queue-grid">
            {pendingRequests.map((req, index) => {
              const isFrontOfQueue = index === 0;

              return (
                <div 
                  key={req.id} 
                  className="queue-card"
                  style={isFrontOfQueue ? { borderColor: 'var(--accent-primary)', boxShadow: '0 4px 16px var(--accent-glow)' } : { opacity: 0.7 }}
                >
                  <span className="queue-number">#{index + 1}</span>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                      <User size={16} className="text-muted" /> {getEmployeeName(req.employeeId)}
                    </h4>
                    <p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
                      Employee ID: #{req.employeeId}
                    </p>
                  </div>
                  <div>
                    <span className="badge primary">{req.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Submitted: {req.submittedAt}
                  </div>
                  
                  <div className="queue-actions">
                    {isFrontOfQueue ? (
                      <>
                        <button 
                          onClick={() => onProcessRequest(req.id, 'Approved')} 
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => onProcessRequest(req.id, 'Rejected')} 
                          className="btn btn-danger btn-sm"
                          style={{ flex: 1 }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="badge warning" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                        Waiting for front item...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h3 className="card-title" style={{ marginTop: 32 }}>
          Processed Requests Log
        </h3>
        <div className="table-container">
          <table className="custom-table" style={{ fontSize: 14 }}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Status</th>
                <th>Processed Date</th>
              </tr>
            </thead>
            <tbody>
              {processedRequests.slice(-5).reverse().map((req) => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 500 }}>{getEmployeeName(req.employeeId)}</td>
                  <td>{req.type}</td>
                  <td>
                    <span className={`badge ${req.status === 'Approved' ? 'success' : 'danger'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.processedAt || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Submit Time-Off Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employeeSelect">Select Employee</label>
            <select
              id="employeeSelect"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="form-control"
              required
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department} - {emp.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="leaveTypeSelect">Leave Type</label>
            <select
              id="leaveTypeSelect"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="form-control"
              required
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick">Sick Leave</option>
              <option value="Personal">Personal Leave</option>
              <option value="Maternity">Maternity/Paternity</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Add to Queue (FIFO)
          </button>
        </form>
      </div>
    </div>
  );
}
