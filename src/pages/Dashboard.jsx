import React from 'react';
import { Users, Clock, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';
import AvailabilityBoard from '../components/AvailabilityBoard';

export default function Dashboard({ employees, leaveRequests, tasks }) {
  const totalEmployees = employees.length;
  const pendingLeaves = leaveRequests.filter(req => req.status === 'Pending').length;
  const activeTasks = tasks.filter(t => t.status === 'In Progress').length;
  
  // Average tenure
  const calculateOverallAverageTenure = () => {
    const today = new Date('2026-06-13');
    let totalYears = 0;
    let count = 0;

    employees.forEach(emp => {
      if (!emp.joinDate) return;
      const join = new Date(emp.joinDate);
      const diffTime = Math.abs(today - join);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      totalYears += diffYears;
      count++;
    });

    return count > 0 ? (totalYears / count).toFixed(1) : 0;
  };

  const avgTenure = calculateOverallAverageTenure();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome to HRPulse</h2>
        <p className="text-muted">Here is a quick snapshot of your workspace today.</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon primary">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <h3>{totalEmployees}</h3>
            <p>Total Staff</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <h3>{pendingLeaves}</h3>
            <p>Leaves in Queue</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon danger">
            <ShieldAlert size={20} />
          </div>
          <div className="stat-info">
            <h3>{activeTasks}</h3>
            <p>Active HR Tasks</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon success">
            <Award size={20} />
          </div>
          <div className="stat-info">
            <h3>{avgTenure} yrs</h3>
            <p>Avg. Tenure</p>
          </div>
        </div>
      </div>

      <div className="split-pane">
        <AvailabilityBoard employees={employees} tasks={tasks} />

        <div className="card">
          <h3 className="card-title">
            <CheckCircle size={18} className="text-success" /> Recent Activities
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <li style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
              <strong>Sarah (HR)</strong> assigned new performance review task.
            </li>
            <li style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
              <strong>David (Engineering)</strong> vacation leave request pending approval.
            </li>
            <li style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
              <strong>John (Developer)</strong> salary updated to $80,000.
            </li>
            <li style={{ paddingBottom: 10 }}>
              System initialized using PapaParse.
            </li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <FileText size={18} className="text-primary" /> System Overview
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          HRPulse is an internal company portal designed for HR professionals to manage the employee lifecycle. 
          All core functionalities are driven by structural data parsed directly from CSV files.
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="badge success">CSV Loaded</span>
            <span style={{ color: 'var(--text-muted)' }}>employees.csv</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="badge success">CSV Loaded</span>
            <span style={{ color: 'var(--text-muted)' }}>leaveRequests.csv</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="badge success">CSV Loaded</span>
            <span style={{ color: 'var(--text-muted)' }}>salaryHistory.csv</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="badge success">CSV Loaded</span>
            <span style={{ color: 'var(--text-muted)' }}>roles.csv</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span className="badge success">CSV Loaded</span>
            <span style={{ color: 'var(--text-muted)' }}>tasks.csv</span>
          </div>
        </div>
      </div>
    </div>
  );
}
