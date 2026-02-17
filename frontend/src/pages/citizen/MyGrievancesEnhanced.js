import React, { useState, useEffect } from 'react';
import * as grievanceService from '../../services/grievanceService';
import '../Auth.css';

const MyGrievancesEnhanced = () => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, in_progress, resolved, closed
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGrievances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [grievances, filter, searchTerm]);

  const loadGrievances = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getUserGrievances();
      if (response.data.success) {
        setGrievances(response.data.grievances);
      }
    } catch (err) {
      console.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = grievances;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(g => g.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.id.toString().includes(searchTerm)
      );
    }

    setFilteredGrievances(filtered);
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: '🔴',
      in_progress: '🟡',
      resolved: '🟢',
      closed: '⚫'
    };
    return icons[status] || '⚪';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336'
    };
    return colors[priority] || '#757575';
  };

  return (
    <div className="grievances-container">
      <div className="grievances-header">
        <h2>📋 My Complaints</h2>
        <p>Track and manage all your submitted complaints</p>
      </div>

      {/* Search and Filter */}
      <div className="grievances-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({grievances.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
            onClick={() => setFilter('open')}
          >
            Open ({grievances.filter(g => g.status === 'open').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress ({grievances.filter(g => g.status === 'in_progress').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({grievances.filter(g => g.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Grievances List */}
      <div className="grievances-list">
        {loading ? (
          <div className="loading">Loading your complaints...</div>
        ) : filteredGrievances.length > 0 ? (
          filteredGrievances.map(grievance => (
            <div key={grievance.id} className="grievance-card">
              <div className="grievance-card-header">
                <div className="grievance-title-section">
                  <span className="status-icon">{getStatusIcon(grievance.status)}</span>
                  <div>
                    <h3>Complaint #{grievance.id}: {grievance.title}</h3>
                    <p className="grievance-category">{grievance.category_name}</p>
                  </div>
                </div>
                <div className="grievance-priority" style={{ color: getPriorityColor(grievance.priority) }}>
                  {grievance.priority.toUpperCase()}
                </div>
              </div>

              <div className="grievance-card-body">
                <p className="grievance-description">{grievance.description.substring(0, 150)}...</p>
              </div>

              <div className="grievance-card-footer">
                <div className="grievance-meta">
                  <span>📅 {new Date(grievance.created_at).toLocaleDateString()}</span>
                  <span>👤 {grievance.assigned_staff_name || 'Not Assigned'}</span>
                  <span className={`status-badge status-${grievance.status}`}>
                    {grievance.status.toUpperCase()}
                  </span>
                </div>
                <a href={`/citizen/grievance/${grievance.id}`} className="view-btn">
                  View Details →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-grievances">
            <p>No complaints found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrievancesEnhanced;
