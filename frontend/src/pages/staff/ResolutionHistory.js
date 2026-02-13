import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

const ResolutionHistory = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="staff" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1>My Resolution History</h1>
            <div style={styles.card}>
              <p>Your resolution history will appear here...</p>
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

export default ResolutionHistory;
