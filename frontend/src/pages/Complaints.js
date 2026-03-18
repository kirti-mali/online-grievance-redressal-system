import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as grievanceService from '../services/grievanceService';
import '../styles/Complaints.css';
import RedesignedMainLayout from '../layouts/RedesignedMainLayout';

const Complaints = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user's complaints or all complaints based on role
      let response;
      if (user?.role === 'admin' || user?.role === 'staff') {
        response = await grievanceService.getAllGrievances();
      } else {
        response = await grievanceService.getUserGrievances();
      }

      if (response?.data?.success) {
        setComplaints(response.data.grievances || []);
      } else {
        setError('Failed to load complaints');
      }
    } catch (err) {
      console.error('Error loading complaints:', err);
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredComplaints = () => {
    let filtered = [...complaints];

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.status?.toLowerCase() === filter.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toString().includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return (priorityOrder[a.priority?.toLowerCase()] || 3) -
                 (priorityOrder[b.priority?.toLowerCase()] || 3);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'badge-warning',
      'in_progress': 'badge-info',
      'resolved': 'badge-success',
      'closed': 'badge-secondary',
      'rejected': 'badge-danger'
    };
    
    const className = statusMap[status?.toLowerCase()] || 'badge-secondary';
    return (
      <span className={`badge ${className}`}>
        {status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'info'
    };
    
    return (
      <span className={`badge bg-${priorityMap[priority?.toLowerCase()] || 'secondary'}`}>
        {priority ? priority.toUpperCase() : 'NORMAL'}
      </span>
    );
  };

  const filteredComplaints = getFilteredComplaints();
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const handleViewComplaint = (id) => {
    navigate(`/citizen/complaint/${id}`);
  };

  const handleNewComplaint = () => {
    navigate('/citizen/submit-complaint');
  };

  if (loading) {
    return (
      <RedesignedMainLayout>
        <div className="complaints-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading complaints...</p>
        </div>
      </RedesignedMainLayout>
    );
  }

  return (
    <RedesignedMainLayout>
      <div className="complaints-page">
        <div className="complaints-header">
          <div className="header-content">
            <h1>Complaints & Grievances</h1>
            <p className="text-muted">Manage and track all your complaints</p>
          </div>
          {user?.role === 'citizen' && (
            <button className="btn btn-primary btn-lg" onClick={handleNewComplaint}>
              <i className="bi bi-plus-circle"></i> New Complaint
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="complaints-filters">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search complaints by title, description, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="sort-group">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>

        {paginatedComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Complaints Found</h3>
            <p>{searchTerm ? 'No complaints match your search criteria.' : 'You haven\'t submitted any complaints yet.'}</p>
            {user?.role === 'citizen' && (
              <button className="btn btn-primary mt-3" onClick={handleNewComplaint}>
                Submit Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="complaints-stats">
              <div className="stat-item">
                <span className="stat-label">Total Results:</span>
                <span className="stat-value">{filteredComplaints.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Page:</span>
                <span className="stat-value">{currentPage} of {totalPages}</span>
              </div>
            </div>

            <div className="complaints-list">
              {paginatedComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`complaint-card status-${(complaint.status || 'pending').toLowerCase()}`}
                  onClick={() => handleViewComplaint(complaint.id)}
                >
                  <div className="complaint-header">
                    <div className="complaint-title-section">
                      <h5 className="complaint-title">{complaint.title || 'Untitled Complaint'}</h5>
                      <small className="complaint-id">ID: {complaint.id}</small>
                    </div>
                    <div className="complaint-badges">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                    </div>
                  </div>

                  <p className="complaint-description">
                    {complaint.description?.substring(0, 150)}
                    {complaint.description?.length > 150 ? '...' : ''}
                  </p>

                  <div className="complaint-meta">
                    <div className="meta-item">
                      <span className="meta-label">Category:</span>
                      <span className="meta-value">{complaint.category_name || 'General'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">
                        {new Date(complaint.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Assigned To:</span>
                      <span className="meta-value">{complaint.assigned_to || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="complaint-footer">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewComplaint(complaint.id);
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination-nav" aria-label="Complaints pagination">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </RedesignedMainLayout>
  );
};

export default Complaints;
