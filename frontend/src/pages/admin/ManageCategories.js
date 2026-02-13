import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

const ManageCategories = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Manage Categories</h1>
            <div style={styles.card}>
              <p>Category management interface will appear here...</p>
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

export default ManageCategories;
