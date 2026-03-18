import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import { AuthContext } from '../../context/AuthContext';
import * as grievanceService from '../../services/grievanceService';

const StatCard = ({ label, value, color }) => (
  <div style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
    <div style={{ fontSize: '36px', fontWeight: 700, color, marginBottom: '6px' }}>{value ?? 0}</div>
    <div style={{ color: '#5f6368', fontSize: '14px' }}>{label}</div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    grievanceService.getStatistics()
      .then(r => setStats(r.data.statistics))
      .catch(() => {});
  }, []);

  const links = [
    { to: '/admin/users', label: '👥 Manage Users' },
    { to: '/admin/grievances', label: '📋 All Grievances' },
    { to: '/admin/categories', label: '🏷️ Categories' },
    { to: '/admin/reports', label: '📊 Reports' },
  ];

  return (
    <RedesignedMainLayout role="admin">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '28px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>Admin Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Welcome back, {user?.name}</p>
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <StatCard label="Total Grievances" value={stats.total_grievances} color="#1a73e8" />
            <StatCard label="Open" value={stats.open_grievances} color="#e53935" />
            <StatCard label="In Progress" value={stats.in_progress_grievances} color="#f57c00" />
            <StatCard label="Resolved" value={stats.resolved_grievances} color="#2e7d32" />
            <StatCard label="Total Citizens" value={stats.total_citizens} color="#6a1b9a" />
            <StatCard label="Total Staff" value={stats.total_staff} color="#00838f" />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display: 'block', padding: '16px 20px', background: '#1a73e8', color: 'white',
              textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', textAlign: 'center'
            }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </RedesignedMainLayout>
  );
};

export default AdminDashboard;
