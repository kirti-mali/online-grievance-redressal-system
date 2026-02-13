import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as grievanceService from '../../services/grievanceService';

const CitizenDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await grievanceService.getStatistics();
        setStats(response.data.statistics);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="citizen" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Citizen Dashboard</h1>
            
            {stats && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{stats.total_grievances || 0}</div>
                  <div style={styles.statLabel}>Total Grievances</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{stats.open_grievances || 0}</div>
                  <div style={styles.statLabel}>Open</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{stats.in_progress_grievances || 0}</div>
                  <div style={styles.statLabel}>In Progress</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{stats.resolved_grievances || 0}</div>
                  <div style={styles.statLabel}>Resolved</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <h2>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/citizen/raise-grievance" className="btn btn-primary">
                  File New Grievance
                </a>
                <a href="/citizen/my-grievances" className="btn btn-secondary">
                  View My Grievances
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
    marginTop: '2rem'
  },
  statCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#3498db',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#666',
    fontSize: '0.95rem'
  }
};

export default CitizenDashboard;
