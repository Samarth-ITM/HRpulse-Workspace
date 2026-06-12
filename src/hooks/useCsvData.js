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
