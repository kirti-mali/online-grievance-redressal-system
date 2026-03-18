import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import { AuthContext } from '../../context/AuthContext';
import * as grievanceService from '../../services/grievanceService';

const statusColor = { open: '#e53935', in_progress: '#f57c00', resolved: '#2e7d32', closed: '#757575' };

const actionBtn = (bg, color = 'white', border = 'none') => ({
  padding: '10px 20px', background: bg, color, border, borderRadius: '6px',
  textDecoration: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
});

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grievanceService.getUserGrievances(1, 100)
      .then(r => setGrievances(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const count = (status) => grievances.filter(g => g.status === status).length;

  const stats = [
    { label: 'Total Filed', value: grievances.length, color: '#1a73e8' },
    { label: 'Open', value: count('open'), color: '#e53935' },
    { label: 'In Progress', value: count('in_progress'), color: '#f57c00' },
    { label: 'Resolved', value: count('resolved'), color: '#2e7d32' },
  ];

  const recent = grievances.slice(0, 5);

  return (
    <RedesignedMainLayout role="citizen">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>Welcome, {user?.name}</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Track and manage your grievances</p>
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

        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <Link to="/citizen/raise-grievance" style={actionBtn('#1a73e8')}>+ File New Grievance</Link>
          <Link to="/citizen/my-grievances" style={actionBtn('transparent', '#1a73e8', '1px solid #1a73e8')}>View All Grievances</Link>
          <Link to="/citizen/track" style={actionBtn('transparent', '#1a73e8', '1px solid #1a73e8')}>Track Status</Link>
        </div>

        {recent.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f4', fontWeight: 600, fontSize: '15px' }}>
              Recent Grievances
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  {['#', 'Title', 'Category', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(g => (
                  <tr key={g.id} style={{ borderTop: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>#{g.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{g.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{g.category_name || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: statusColor[g.status], color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                        {g.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{new Date(g.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/citizen/grievance/${g.id}`} style={{ color: '#1a73e8', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </RedesignedMainLayout>
  );
};

export default CitizenDashboard;
