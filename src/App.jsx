import React, { useState } from 'react';
import { useCsvData } from './hooks/useCsvData';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Settings from './pages/Settings';
import OrgChart from './components/OrgChart';
import { LayoutDashboard, Users, GitFork, Clock, ShieldCheck } from 'lucide-react';

export default function App() {
  const {
    employees,
    setEmployees,
    leaveRequests,
    setLeaveRequests,
    salaryHistory,
    setSalaryHistory,
    roles,
    setRoles,
    tasks,
    setTasks,
    loading
  } = useCsvData();

  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Non-persistent round-robin index
  const [taskNextIndex, setTaskNextIndex] = useState(0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, backgroundColor: 'var(--bg-primary)' }}>
        <div className="logo-icon" style={{ width: 64, height: 64, fontSize: 24 }}>HP</div>
        <p style={{ color: 'var(--text-muted)' }}>Loading HRPulse Workspace...</p>
      </div>
    );
  }

  // salary update handler
  const handleUpdateSalary = (empId, newSalary) => {
    const empIndex = employees.findIndex(e => e.id === empId);
    if (empIndex === -1) return;

    const oldSalary = employees[empIndex].salary;
    const today = new Date().toISOString().split('T')[0];

    // Create history record
    const nextHistoryId = salaryHistory.length > 0 ? Math.max(...salaryHistory.map(h => h.id)) + 1 : 1;
    const newHistoryRecord = {
      id: nextHistoryId,
      employeeId: empId,
      oldSalary: oldSalary,
      newSalary: newSalary,
      date: today
    };

    // Update state
    const updatedEmployees = [...employees];
    updatedEmployees[empIndex] = { ...updatedEmployees[empIndex], salary: newSalary };

    setEmployees(updatedEmployees);
    setSalaryHistory([...salaryHistory, newHistoryRecord]);
  };

  // Undo salary update handler
  const handleUndoSalaryChange = (lastRecord) => {
    const empIndex = employees.findIndex(e => e.id === lastRecord.employeeId);
    if (empIndex === -1) return;

    // Update employee salary back to oldSalary
    const updatedEmployees = [...employees];
    updatedEmployees[empIndex] = { ...updatedEmployees[empIndex], salary: lastRecord.oldSalary };

    setEmployees(updatedEmployees);
    // Remove the last record from history
    setSalaryHistory(salaryHistory.filter(h => h.id !== lastRecord.id));
  };

  // Leave queue handlers
  const handleSubmitLeave = (newReq) => {
    const nextId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 1;
    const requestWithId = { ...newReq, id: nextId };
    setLeaveRequests([...leaveRequests, requestWithId]);
  };

  const handleProcessLeave = (reqId, newStatus) => {
    setLeaveRequests(leaveRequests.map(req => {
      if (req.id === reqId) {
        return { 
          ...req, 
          status: newStatus,
          processedAt: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    }));
  };

  // HR tasks handlers (Operational state derived, no duplicate employee modifications)
  const handleAddTask = (newTask) => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([...tasks, { ...newTask, id: nextId }]);
  };

  // Complete task handler
  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Completed' };
      }
      return t;
    }));
  };

  // Render Page Selection
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard employees={employees} leaveRequests={leaveRequests} tasks={tasks} />;
      case 'employees':
        return <Employees employees={employees} onUpdateSalary={handleUpdateSalary} />;
      case 'orgchart':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Company Structure Tree</h2>
              <p className="text-muted">Interactive reporting viewer. Collapse and expand nodes as needed.</p>
            </div>
            <div className="card">
              <OrgChart employees={employees} />
            </div>
          </div>
        );
      case 'leaves':
        return (
          <Leaves 
            leaveRequests={leaveRequests} 
            employees={employees} 
            onSubmitRequest={handleSubmitLeave} 
            onProcessRequest={handleProcessLeave} 
          />
        );
      case 'settings':
        return (
          <Settings 
            employees={employees} 
            roles={roles} 
            tasks={tasks} 
            salaryHistory={salaryHistory} 
            onUpdateRoles={setRoles} 
            onAddTask={handleAddTask} 
            onCompleteTask={handleCompleteTask} 
            onUndoSalaryChange={handleUndoSalaryChange}
            taskNextIndex={taskNextIndex}
            setTaskNextIndex={setTaskNextIndex}
          />
        );
      default:
        return <Dashboard employees={employees} leaveRequests={leaveRequests} tasks={tasks} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">HP</div>
          <span className="logo-text">HRPulse</span>
        </div>

        <nav className="nav-menu">
          <a 
            onClick={() => setCurrentPage('dashboard')} 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard /> Dashboard
          </a>
          <a 
            onClick={() => setCurrentPage('employees')} 
            className={`nav-item ${currentPage === 'employees' ? 'active' : ''}`}
          >
            <Users /> Directory
          </a>
          <a 
            onClick={() => setCurrentPage('orgchart')} 
            className={`nav-item ${currentPage === 'orgchart' ? 'active' : ''}`}
          >
            <GitFork /> Org Chart
          </a>
          <a 
            onClick={() => setCurrentPage('leaves')} 
            className={`nav-item ${currentPage === 'leaves' ? 'active' : ''}`}
          >
            <Clock /> Leave Queue
          </a>
          <a 
            onClick={() => setCurrentPage('settings')} 
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
          >
            <ShieldCheck /> Roles & Tasks
          </a>
        </nav>

        {/* User bar */}
        <div className="user-profile-bar">
          <div className="user-avatar">HR</div>
          <div className="user-info">
            <h4>Sarah Jenkins</h4>
            <p>HR Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main page layout */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
