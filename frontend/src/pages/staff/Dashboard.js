import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import { AuthContext } from '../../context/AuthContext';
import * as grievanceService from '../../services/grievanceService';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grievanceService.getStaffGrievances(1, 100)
      .then(r => setGrievances(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const count = (s) => grievances.filter(g => g.status === s).length;
  const stats = [
    { label: 'Assigned', value: grievances.length, color: '#1a73e8' },
    { label: 'Open', value: count('open'), color: '#e53935' },
    { label: 'In Progress', value: count('in_progress'), color: '#f57c00' },
    { label: 'Resolved', value: count('resolved'), color: '#2e7d32' },
  ];

  return (
    <RedesignedMainLayout role="staff">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>Staff Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Welcome, {user?.name}</p>
        </div>

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ color: '#5f6368', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/staff/grievances" style={actionBtn('#1a73e8')}>View Assigned Grievances</Link>
          <Link to="/staff/resolutions" style={actionBtn('transparent', '#1a73e8', '1px solid #1a73e8')}>My Resolutions</Link>
        </div>
      </div>
    </RedesignedMainLayout>
  );
};

const actionBtn = (bg, color = 'white', border = 'none') => ({
  padding: '10px 20px', background: bg, color, border, borderRadius: '6px',
  textDecoration: 'none', fontWeight: 600, fontSize: '14px'
});

export default StaffDashboard;
