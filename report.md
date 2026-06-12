# HRPulse Workspace - Complete Project Report (Refactored)

This report details the final, production-ready codebase structure, code contents, data flow architecture, and styling rules of the **HRPulse Workspace** application. It aligns with the simplified requirements: loading directly from CSV assets without localStorage caching, using parent hierarchy tree traversals (no BFS graph algorithms), displaying HR staff availability boards, and rendering scrollable directories directly without pagination interfaces.

---

## File System Structure

The final project layout includes static assets, components, state hooks, and page aggregations:

```txt
/Users/samarth/Downloads/React-Project/
 ├── index.html                   # HTML entry point, SEO Meta, and Title tags
 ├── package.json                 # Project dependencies (papaparse, lucide-react)
 ├── vite.config.js               # Dev and build configuration
 ├── prompt.md                    # Initial assignment requirements
 ├── report.md                    # This complete documentation report
 ├── answer.md                    # Detailed Q&A answers report
 ├── public/                      # Static assets folder (served under root)
 │    ├── employees.csv           # Physical CSV of 30 employee records
 │    ├── leaveRequests.csv       # Physical CSV of leave requests
 │    ├── salaryHistory.csv       # Physical CSV of salary log history
 │    ├── roles.csv               # Physical CSV of roles & quote-escaped permissions
 │    └── tasks.csv               # Physical CSV of HR task statuses (normalized)
 └── src/
      ├── main.jsx                # React root renderer
      ├── App.jsx                 # Central page layout, page routing, and handlers
      ├── index.css               # Theme styling and interactive components
      ├── hooks/
      │    └── useCsvData.js      # Custom hook fetching real CSVs directly
      ├── components/
      │    ├── SearchBar.jsx      # Employee search bar input
      │    ├── EmployeeTable.jsx  # Employee list, sorting, input validation, and scrollable sizing
      │    ├── OrgChart.jsx       # Interactive recursive tree structure with cycle safety and root fallback
      │    ├── LeaveQueue.jsx     # Strict FIFO leave requests queue with processed date tracking
      │    ├── SalaryHistory.jsx  # Salary audit logs with LIFO stack Undo trigger
      │    ├── PermissionsHub.jsx # Role-to-permission editor matrices
      │    ├── ReportingChain.jsx # Chain of command path finder using visited Set cycle safety
      │    ├── TaskAssignor.jsx   # HR task dispatcher using round-robin index and dynamic name query
      │    └── AvailabilityBoard.jsx # Dynamic status grid showing busy/available HR staff members
      │    └── TeamTenure.jsx     # Grouped average tenure department sorter
      └── pages/
           ├── Dashboard.jsx      # Overview dashboard page
           ├── Employees.jsx      # Directory page (Debounced Search, Table, Chain, Tenure)
           ├── Leaves.jsx         # Leave processing page (Queue & Form)
           └── Settings.jsx       # Admin settings (Tasks, Availability, Roles, Salary logs)
```

---

## Detailed File Directory & Code Contents

### 1. Data Layer

#### [public/employees.csv](file:///Users/samarth/Downloads/React-Project/public/employees.csv)
```csv
id,name,department,managerId,role,salary,joinDate
1,John,Engineering,5,Developer,80000,2020-01-15
2,Sarah,HR,6,HR Executive,60000,2021-02-10
3,David,Engineering,5,Developer,85000,2019-08-12
4,Alice,Management,,CEO,150000,2015-05-10
5,Marcus,Engineering,4,Engineering Manager,110000,2017-03-22
6,Olivia,HR,4,HR Manager,95000,2018-06-15
7,Diana,Finance,4,Finance Manager,100000,2016-11-01
8,Emily,Engineering,5,QA Engineer,70000,2021-09-01
9,Michael,Engineering,5,Devops Specialist,90000,2018-04-12
10,Sophia,HR,6,Recruiter,58000,2022-01-10
11,Liam,Finance,7,Accountant,65000,2020-07-15
12,Noah,Finance,7,Financial Analyst,72000,2019-11-20
13,Emma,Marketing,4,Marketing Specialist,62000,2021-03-14
14,Lucas,Marketing,13,Content Writer,50000,2022-05-05
15,Ava,Marketing,13,Graphic Designer,55000,2022-06-10
16,William,Engineering,1,Junior Developer,55000,2023-01-15
17,James,Engineering,1,Junior Developer,57000,2023-02-20
18,Benjamin,Engineering,3,Junior Developer,56000,2023-04-10
19,Isabella,HR,2,HR Coordinator,52000,2022-08-12
20,Mia,Finance,11,Junior Accountant,48000,2023-09-01
21,Charlotte,Engineering,5,Technical Lead,105000,2018-01-10
22,Henry,Engineering,21,Senior Developer,95000,2019-05-18
23,Alexander,Engineering,21,Senior Developer,98000,2019-10-22
24,Sebastian,Engineering,22,Intern,30000,2024-01-08
25,Zoe,Marketing,13,Social Media Manager,53000,2022-10-01
26,Daniel,Engineering,23,Intern,30000,2024-03-11
27,Evelyn,HR,6,HR Specialist,67000,2020-04-05
28,Harper,Operations,4,Operations Lead,85000,2017-09-15
29,Logan,Operations,28,Operations Assistant,52000,2021-11-10
30,Gabriel,Operations,28,Logistics Coordinator,58000,2020-10-01
```

#### [public/leaveRequests.csv](file:///Users/samarth/Downloads/React-Project/public/leaveRequests.csv)
```csv
id,employeeId,type,status,submittedAt
1,3,Vacation,Pending,2025-01-05
2,1,Sick,Approved,2025-01-06
3,16,Personal,Pending,2025-01-07
4,2,Maternity,Pending,2025-01-08
5,12,Vacation,Approved,2025-01-09
6,24,Sick,Pending,2025-01-10
```

#### [public/salaryHistory.csv](file:///Users/samarth/Downloads/React-Project/public/salaryHistory.csv)
```csv
id,employeeId,oldSalary,newSalary,date
1,3,80000,85000,2025-01-10
2,1,75000,80000,2024-12-15
3,9,85000,90000,2024-11-20
4,21,100000,105000,2025-01-02
```

#### [public/roles.csv](file:///Users/samarth/Downloads/React-Project/public/roles.csv)
```csv
role,permissions
HR,"editEmployees,assignTasks,manageLeaves"
Manager,"approveLeave,viewReportingChain"
Employee,"viewProfile,requestLeave"
```

#### [public/tasks.csv](file:///Users/samarth/Downloads/React-Project/public/tasks.csv)
```csv
id,title,assignedToId,status,date
1,Quarterly HR Performance Review Audit,2,In Progress,2026-06-12
2,New Employee Onboarding Paperwork,10,Completed,2026-06-11
```

#### [useCsvData.js](file:///Users/samarth/Downloads/React-Project/src/hooks/useCsvData.js)
```javascript
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

export function useCsvData() {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper to parse file from public directory using PapaParse
    const parseFile = (url) => {
      return new Promise((resolve, reject) => {
        Papa.parse(url, {
          download: true,
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => resolve(results.data),
          error: (err) => reject(err),
        });
      });
    };

    Promise.all([
      parseFile('/employees.csv'),
      parseFile('/leaveRequests.csv'),
      parseFile('/salaryHistory.csv'),
      parseFile('/roles.csv'),
      parseFile('/tasks.csv')
    ])
      .then(([empData, leaveData, salaryData, roleData, taskData]) => {
        const parsedRoles = roleData.map(r => ({
          role: r.role,
          permissions: r.permissions ? r.permissions.split(',') : []
        }));

        setEmployees(empData);
        setLeaveRequests(leaveData);
        setSalaryHistory(salaryData);
        setRoles(parsedRoles);
        setTasks(taskData);
      })
      .catch((err) => {
        console.error('Error loading and parsing CSV files:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
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
  };
}
```

---

### 2. Central App Controller

#### [App.jsx](file:///Users/samarth/Downloads/React-Project/src/App.jsx)
```javascript
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
```

---

### 3. Modular & Interactive Components

#### [EmployeeTable.jsx](file:///Users/samarth/Downloads/React-Project/src/components/EmployeeTable.jsx)
```javascript
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
```

#### [LeaveQueue.jsx](file:///Users/samarth/Downloads/React-Project/src/components/LeaveQueue.jsx)
```javascript
import React, { useState } from 'react';
import { User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function LeaveQueue({ leaveRequests, employees, onSubmitRequest, onProcessRequest }) {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Vacation');

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

        <h3 className="card-title" style={{ marginTop: 32 }}>Processed Requests Log</h3>
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
```

#### [ReportingChain.jsx](file:///Users/samarth/Downloads/React-Project/src/components/ReportingChain.jsx)
```javascript
import React, { useState } from 'react';
import { ArrowRight, Network } from 'lucide-react';

export default function ReportingChain({ employees }) {
  const [selectedId, setSelectedId] = useState('');

  // Simple parent traversal logic with Set-based cycle detection
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
```

#### [AvailabilityBoard.jsx](file:///Users/samarth/Downloads/React-Project/src/components/AvailabilityBoard.jsx)
```javascript
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
              const activeTasksCount = tasks ? tasks.filter(
                t => t.assignedToId === emp.id && t.status !== 'Completed'
              ).length : 0;
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
```

#### [TaskAssignor.jsx](file:///Users/samarth/Downloads/React-Project/src/components/TaskAssignor.jsx)
```javascript
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
```

#### [OrgChart.jsx](file:///Users/samarth/Downloads/React-Project/src/components/OrgChart.jsx)
```javascript
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function TreeNode({ node, employees, onSelect, visited = new Set() }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (visited.has(node.id)) {
    return (
      <div className="tree-node-wrapper">
        <div className="cycle-warning" style={{ color: 'var(--danger)', fontSize: 13, padding: '8px 12px', borderRadius: 6, border: '1px dashed var(--danger)', backgroundColor: 'var(--danger-glow)', fontWeight: 600 }}>
          Circular Reference Detected (ID: #{node.id})
        </div>
      </div>
    );
  }

  // Find children of this employee
  const children = employees.filter(emp => emp.managerId === node.id);
  const hasChildren = children.length > 0;

  const nextVisited = new Set(visited);
  nextVisited.add(node.id);

  return (
    <div className="tree-node-wrapper">
      <div 
        className="tree-node-card"
        onClick={() => onSelect && onSelect(node)}
      >
        <div className="tree-node-name">{node.name}</div>
        <div className="tree-node-role">{node.role}</div>
        <div className="tree-node-dept">{node.department}</div>
        
        {hasChildren && (
          <button 
            className="collapse-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {children.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              employees={employees} 
              onSelect={onSelect} 
              visited={nextVisited}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChart({ employees, onSelectEmployee }) {
  // Find roots (employees with no manager or managerId not matching any valid employee)
  const employeeIds = employees.map(e => e.id);
  const detectedRoots = employees.filter(emp => !emp.managerId || !employeeIds.includes(emp.managerId));

  // Fallback to first employee if no root detected to prevent org chart disappearance
  const roots = detectedRoots.length > 0
    ? detectedRoots
    : employees.length > 0
      ? [employees[0]]
      : [];

  return (
    <div className="tree-container">
      {roots.length === 0 ? (
        <p className="text-muted">No organizational roots found.</p>
      ) : (
        roots.map(root => (
          <div key={root.id} className="tree-root">
            <TreeNode 
              node={root} 
              employees={employees} 
              onSelect={onSelectEmployee} 
              visited={new Set()}
            />
          </div>
        ))
      )}
    </div>
  );
}
```

#### [PermissionsHub.jsx](file:///Users/samarth/Downloads/React-Project/src/components/PermissionsHub.jsx)
```javascript
import React, { useState } from 'react';
import { Shield, ShieldAlert, Plus, Trash } from 'lucide-react';

export default function PermissionsHub({ roles, onUpdateRoles }) {
  const [newPermission, setNewPermission] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]?.role || '');

  const handleAddPermission = (e) => {
    e.preventDefault();
    if (!newPermission.trim() || !selectedRole) return;

    const updatedRoles = roles.map(r => {
      if (r.role === selectedRole) {
        if (r.permissions.includes(newPermission.trim())) return r;
        return {
          ...r,
          permissions: [...r.permissions, newPermission.trim()]
        };
      }
      return r;
    });

    onUpdateRoles(updatedRoles);
    setNewPermission('');
  };

  const handleRemovePermission = (roleName, permission) => {
    const updatedRoles = roles.map(r => {
      if (r.role === roleName) {
        return {
          ...r,
          permissions: r.permissions.filter(p => p !== permission)
        };
      }
      return r;
    });
    onUpdateRoles(updatedRoles);
  };

  return (
    <div className="split-pane">
      <div className="card">
        <h3 className="card-title">
          <Shield size={20} className="text-primary" /> Role Access Matrix
        </h3>
        <p className="text-muted" style={{ marginBottom: 20, fontSize: 14 }}>
          Security rules and access levels defined for different employee roles.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roles.map((r) => (
            <div key={r.role} className="card" style={{ padding: 16, backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 12, width: '100%' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <ShieldAlert size={16} className="text-primary" /> {r.role}
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {r.permissions.length === 0 ? (
                  <span className="text-muted" style={{ fontSize: 13 }}>No permissions assigned.</span>
                ) : (
                  r.permissions.map((perm) => (
                    <span 
                      key={perm} 
                      className="badge primary" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingRight: 6 }}
                    >
                      {perm}
                      <Trash 
                        size={12} 
                        style={{ cursor: 'pointer', color: 'var(--danger)' }} 
                        onClick={() => handleRemovePermission(r.role, perm)} 
                      />
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Assign New Permission</h3>
        <form onSubmit={handleAddPermission}>
          <div className="form-group">
            <label htmlFor="roleSelect">Target Role</label>
            <select
              id="roleSelect"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-control"
              required
            >
              {roles.map(r => (
                <option key={r.role} value={r.role}>
                  {r.role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="permissionInput">Permission Name</label>
            <input
              type="text"
              id="permissionInput"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              className="form-control"
              placeholder="e.g. viewSalaryHistory, terminateEmployee"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            <Plus size={16} /> Add Permission
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### [SalaryHistory.jsx](file:///Users/samarth/Downloads/React-Project/src/components/SalaryHistory.jsx)
```javascript
import React from 'react';
import { RotateCcw, DollarSign, Calendar, User } from 'lucide-react';

export default function SalaryHistory({ salaryHistory, employees, onUndoChange }) {
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === Number(id));
    return emp ? emp.name : `Employee #${id}`;
  };

  const sortedHistory = [...salaryHistory].reverse();
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
```

#### [SearchBar.jsx](file:///Users/samarth/Downloads/React-Project/src/components/SearchBar.jsx)
```javascript
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search employee name, department, role..." }) {
  return (
    <div className="search-input-wrapper">
      <Search className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        placeholder={placeholder}
      />
    </div>
  );
}
```

#### [TeamTenure.jsx](file:///Users/samarth/Downloads/React-Project/src/components/TeamTenure.jsx)
```javascript
import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';

export default function TeamTenure({ employees }) {
  const calculateAverageTenures = () => {
    const today = new Date('2026-06-13');
    const deptData = {};

    employees.forEach(emp => {
      if (!emp.department || !emp.joinDate) return;
      
      const join = new Date(emp.joinDate);
      const diffTime = Math.abs(today - join);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

      if (!deptData[emp.department]) {
        deptData[emp.department] = {
          totalYears: 0,
          count: 0
        };
      }

      deptData[emp.department].totalYears += diffYears;
      deptData[emp.department].count += 1;
    });

    const result = Object.keys(deptData).map(dept => {
      const avg = deptData[dept].totalYears / deptData[dept].count;
      return {
        department: dept,
        averageTenure: parseFloat(avg.toFixed(1)),
        headcount: deptData[dept].count
      };
    });

    return result.sort((a, b) => b.averageTenure - a.averageTenure);
  };

  const tenures = calculateAverageTenures();

  return (
    <div className="card">
      <h3 className="card-title">
        <Award size={20} className="text-primary" /> Team Tenure Sorter
      </h3>
      <p className="text-muted" style={{ marginBottom: 20, fontSize: 14 }}>
        Departments ranked by the average time staff members have been with the company.
      </p>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Department</th>
              <th>Average Tenure</th>
              <th>Headcount</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {tenures.map((item, index) => {
              const isTop = index === 0;
              return (
                <tr key={item.department} style={isTop ? { backgroundColor: 'rgba(16, 185, 129, 0.04)' } : {}}>
                  <td style={{ fontWeight: 700 }}>
                    {isTop ? '#1' : `#${index + 1}`}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.department}
                  </td>
                  <td>
                    <strong>{item.averageTenure} years</strong>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} className="text-muted" />
                      {item.headcount} employee{item.headcount > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    {item.averageTenure > 4 ? (
                      <span className="badge success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp size={12} /> High Retention
                      </span>
                    ) : item.averageTenure > 2 ? (
                      <span className="badge primary">Healthy</span>
                    ) : (
                      <span className="badge warning">New Team</span>
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
```

---

### 4. Page Views

#### [Dashboard.jsx](file:///Users/samarth/Downloads/React-Project/src/pages/Dashboard.jsx)
```javascript
import React from 'react';
import { Users, Clock, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

export default function Dashboard({ employees, leaveRequests, tasks }) {
  const totalEmployees = employees.length;
  const pendingLeaves = leaveRequests.filter(req => req.status === 'Pending').length;
  const activeTasks = tasks.filter(t => t.status === 'In Progress').length;
  
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
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalEmployees}</h3>
            <p>Total Staff</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{pendingLeaves}</h3>
            <p>Leaves in Queue</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon danger">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeTasks}</h3>
            <p>Active HR Tasks</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon success">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <h3>{avgTenure} yrs</h3>
            <p>Avg. Tenure</p>
          </div>
        </div>
      </div>

      <div className="split-pane">
        <div className="card">
          <h3 className="card-title">
            <FileText size={18} className="text-primary" /> System Overview
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            HRPulse is an internal company portal designed for HR professionals to manage the employee lifecycle. 
            All core functionalities are driven by structural data parsed directly from CSV files.
          </p>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span className="badge success">CSV Loaded</span>
              <span style={{ color: 'var(--text-muted)' }}>employees.csv loaded successfully</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span className="badge success">CSV Loaded</span>
              <span style={{ color: 'var(--text-muted)' }}>leaveRequests.csv loaded successfully</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span className="badge success">CSV Loaded</span>
              <span style={{ color: 'var(--text-muted)' }}>salaryHistory.csv loaded successfully</span>
            </div>
          </div>
        </div>

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
    </div>
  );
}
```

#### [Employees.jsx](file:///Users/samarth/Downloads/React-Project/src/pages/Employees.jsx)
```javascript
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';
import ReportingChain from '../components/ReportingChain';
import TeamTenure from '../components/TeamTenure';
import { Users, Filter } from 'lucide-react';

export default function Employees({ employees, onUpdateSalary }) {
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [searchVal]);

  const filteredEmployees = employees.filter(emp => {
    const name = emp.name ? String(emp.name).toLowerCase() : '';
    const role = emp.role ? String(emp.role).toLowerCase() : '';
    const dept = emp.department ? String(emp.department).toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = 
      name.includes(query) ||
      role.includes(query) ||
      dept.includes(query);
      
    const matchesDept = selectedDept === '' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Employee Directory</h2>
        <p className="text-muted">Search, filter, update salaries, and track report chains.</p>
      </div>

      <div className="card">
        <h3 className="card-title">
          <Users size={20} className="text-primary" /> Active Personnel
        </h3>

        <div className="search-controls">
          <SearchBar value={searchVal} onChange={setSearchVal} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} className="text-muted" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select-filter"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <p className="text-muted" style={{ padding: '24px 0', textAlign: 'center' }}>
            No employees match your search criteria.
          </p>
        ) : (
          <EmployeeTable employees={filteredEmployees} onUpdateSalary={onUpdateSalary} />
        )}
      </div>

      <div className="split-pane">
        <ReportingChain employees={employees} />
        <TeamTenure employees={employees} />
      </div>
    </div>
  );
}
```

#### [Leaves.jsx](file:///Users/samarth/Downloads/React-Project/src/pages/Leaves.jsx)
```javascript
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
```

#### [Settings.jsx](file:///Users/samarth/Downloads/React-Project/src/pages/Settings.jsx)
```javascript
import React from 'react';
import PermissionsHub from '../components/PermissionsHub';
import TaskAssignor from '../components/TaskAssignor';
import SalaryHistory from '../components/SalaryHistory';
import AvailabilityBoard from '../components/AvailabilityBoard';

export default function Settings({ 
  employees, 
  roles, 
  tasks, 
  salaryHistory, 
  onUpdateRoles, 
  onAddTask, 
  onCompleteTask, 
  onUndoSalaryChange,
  taskNextIndex,
  setTaskNextIndex
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Roles & Tasks Hub</h2>
        <p className="text-muted">Manage system access levels, log salary modifications, and assign HR duties.</p>
      </div>

      <TaskAssignor 
        employees={employees} 
        tasks={tasks} 
        onAddTask={onAddTask} 
        onCompleteTask={onCompleteTask} 
        taskNextIndex={taskNextIndex}
        setTaskNextIndex={setTaskNextIndex}
      />

      <AvailabilityBoard 
        employees={employees} 
        tasks={tasks}
      />

      <PermissionsHub 
        roles={roles} 
        onUpdateRoles={onUpdateRoles} 
      />

      <SalaryHistory 
        salaryHistory={salaryHistory} 
        employees={employees} 
        onUndoChange={onUndoSalaryChange} 
      />
    </div>
  );
}
```

#### [main.jsx](file:///Users/samarth/Downloads/React-Project/src/main.jsx)
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Theme & Design System Summary

The styling for the application is written entirely in Vanilla CSS within [index.css](file:///Users/samarth/Downloads/React-Project/src/index.css). 

### Colors (Sleek Dark Slate Palette):
* **Background Primary**: `hsl(222, 47%, 11%)` (Deep slate night)
* **Background Card**: `rgba(30, 41, 59, 0.45)` (Semi-transparent backdrop-filter glassmorphic card)
* **Accent Primary**: `hsl(250, 89%, 65%)` (Vibrant Indigo)
* **Text Primary**: `hsl(210, 40%, 98%)` (Crisp white)
* **Text Muted**: `hsl(215, 20%, 65%)` (Slate grey)
* **Success**: `hsl(142, 70%, 45%)` (Emerald Green)
* **Danger**: `hsl(350, 80%, 55%)` (Ruby Red)

### Layout & Sizing Rules:
* **Directory Grid**: Sized up to a height of `600px` with `overflow-y: auto` enabled, allowing easy directory browsing without paginated pages.
* **Border Radius**: Unified `12px` and `16px` curves with `backdrop-filter: blur(16px)` on cards.
* **Micro-interactions**: Hover overlays, button scale transitions (`transition: all 0.2s ease`), and dashed border states for active items.
