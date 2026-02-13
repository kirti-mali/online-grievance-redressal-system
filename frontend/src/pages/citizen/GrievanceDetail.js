import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as grievanceService from '../../services/grievanceService';
import * as resolutionService from '../../services/resolutionService';

const GrievanceDetail = () => {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  const fetchGrievance = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getGrievanceById(id);
      setGrievance(response.data.grievance);
    } catch (error) {
      console.error('Error fetching grievance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!grievance) return <div><Header /><h1>Grievance not found</h1><Footer /></div>;

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="citizen" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Grievance #{grievance.id}</h1>

            <div style={styles.card}>
              <h2>{grievance.title}</h2>
              <div style={styles.meta}>
                <span><strong>Status:</strong> {grievance.status}</span>
                <span><strong>Priority:</strong> {grievance.priority}</span>
                <span><strong>Category:</strong> {grievance.category_name}</span>
                <span><strong>Date:</strong> {new Date(grievance.created_at).toLocaleDateString()}</span>
              </div>

              <div style={styles.section}>
                <h3>Description</h3>
                <p>{grievance.description}</p>
              </div>

              {grievance.assigned_staff_name && (
                <div style={styles.section}>
                  <h3>Assigned To</h3>
                  <p>{grievance.assigned_staff_name}</p>
                </div>
              )}

              {grievance.resolutions && grievance.resolutions.length > 0 && (
                <div style={styles.section}>
                  <h3>Resolutions</h3>
                  {grievance.resolutions.map(res => (
                    <div key={res.id} style={styles.resolution}>
                      <p><strong>{res.staff_name}</strong> - {new Date(res.created_at).toLocaleDateString()}</p>
                      <p>{res.notes}</p>
                    </div>
                  ))}
                </div>
              )}
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
  },
  meta: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee'
  },
  section: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee'
  },
  resolution: {
    background: '#f5f5f5',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  }
};

export default GrievanceDetail;
