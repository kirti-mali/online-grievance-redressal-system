import React, { useContext } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="staff" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Staff Dashboard</h1>
            <div style={styles.card}>
              <h2>Welcome, {user?.name}</h2>
              <p>Manage grievances assigned to you and add resolutions.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="/staff/grievances" className="btn btn-primary">
                  View Assigned Grievances
                </a>
                <a href="/staff/resolutions" className="btn btn-secondary">
                  My Resolutions
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
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '2rem'
  }
};

export default StaffDashboard;
