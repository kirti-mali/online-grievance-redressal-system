import React, { useContext } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Admin Dashboard</h1>
            <div style={styles.card}>
              <h2>Welcome, {user?.name}</h2>
              <p>Manage the entire grievance redressal system.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="/admin/users" className="btn btn-primary">
                  Manage Users
                </a>
                <a href="/admin/grievances" className="btn btn-primary">
                  All Grievances
                </a>
                <a href="/admin/categories" className="btn btn-primary">
                  Categories
                </a>
                <a href="/admin/reports" className="btn btn-primary">
                  Reports
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

export default AdminDashboard;
