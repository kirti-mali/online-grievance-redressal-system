import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Unauthorized = () => {
  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.heading}>403</h1>
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access this page.</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    background: '#f8f9fa'
  },
  content: {
    textAlign: 'center'
  },
  heading: {
    fontSize: '5rem',
    color: '#e74c3c',
    margin: '0 0 1rem'
  }
};

export default Unauthorized;
