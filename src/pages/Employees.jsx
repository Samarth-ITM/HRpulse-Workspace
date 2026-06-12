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

  // Extract unique departments for filter dropdown
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  // Debouncing effect for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [searchVal]);

  // Search filter logic using debounced searchQuery
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
