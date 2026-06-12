import React from 'react';
import LeaveQueue from '../components/LeaveQueue';

export default function Leaves({ leaveRequests, employees, onSubmitRequest, onProcessRequest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Time-Off Requests</h2>
        <p className="text-muted">Manage the vacation and sick leave queue in submission order.</p>
      </div>

      <LeaveQueue 
        leaveRequests={leaveRequests} 
        employees={employees} 
        onSubmitRequest={onSubmitRequest} 
        onProcessRequest={onProcessRequest} 
      />
    </div>
  );
}
