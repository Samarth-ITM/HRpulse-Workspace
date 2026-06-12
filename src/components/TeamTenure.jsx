import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';

export default function TeamTenure({ employees }) {
  const calculateAverageTenures = () => {
    const today = new Date('2026-06-13'); // Fixed current time context for stability
    const deptData = {};

    employees.forEach(emp => {
      if (!emp.department || !emp.joinDate) return;
      
      const join = new Date(emp.joinDate);
      const diffTime = Math.abs(today - join);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); // years

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

    // Sort descending by average tenure
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
              // Add simple visual style for the top rank
              const isTop = index === 0;
              return (
                <tr key={item.department} style={isTop ? { backgroundColor: 'rgba(16, 185, 129, 0.04)' } : {}}>
                  <td style={{ fontWeight: 700 }}>
                    {isTop ? '🥇' : `#${index + 1}`}
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
