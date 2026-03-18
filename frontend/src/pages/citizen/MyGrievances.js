import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import * as grievanceService from '../../services/grievanceService';

const MyGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGrievances(page);
  }, [page]);

  const fetchGrievances = async (pageNum) => {
    try {
      setLoading(true);
      const response = await grievanceService.getUserGrievances(pageNum, 10);
      setGrievances(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching grievances:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <RedesignedMainLayout role="citizen">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={styles.header}>
              <h1>My Grievances</h1>
              <Link to="/citizen/raise-grievance" className="btn btn-primary">
                File New Grievance
              </Link>
            </div>

            {grievances.length === 0 ? (
              <div style={styles.empty}>
                <p>No grievances found</p>
                <Link to="/citizen/raise-grievance" className="btn btn-primary">
                  File Your First Grievance
                </Link>
              </div>
            ) : (
              <>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grievances.map(g => (
                        <tr key={g.id}>
                          <td>#{g.id}</td>
                          <td>{g.title}</td>
                          <td>{g.category_name}</td>
                          <td><span style={getPriorityStyle(g.priority)}>{g.priority}</span></td>
                          <td><span style={getStatusStyle(g.status)}>{g.status}</span></td>
                          <td>{new Date(g.created_at).toLocaleDateString()}</td>
                          <td>
                            <Link to={`/citizen/grievance/${g.id}`} className="btn" style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} pages={totalPages} onPageChange={setPage} />
              </>
            )}
        </div>
    </RedesignedMainLayout>
  );
};

const getPriorityStyle = (priority) => ({
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontWeight: '500',
  backgroundColor: priority === 'high' ? '#e74c3c' : priority === 'medium' ? '#f39c12' : '#27ae60',
  color: 'white'
});

const getStatusStyle = (status) => ({
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontWeight: '500',
  backgroundColor: status === 'open' ? '#3498db' : status === 'in_progress' ? '#f39c12' : status === 'resolved' ? '#27ae60' : '#95a5a6',
  color: 'white'
});

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
};

export default MyGrievances;
