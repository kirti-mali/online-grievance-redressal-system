import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.heading}>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
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
    color: 'var(--primary-color)',
    margin: '0 0 1rem'
  }
};

export default NotFound;
