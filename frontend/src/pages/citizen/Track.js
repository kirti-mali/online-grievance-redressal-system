import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as grievanceService from '../../services/grievanceService';
import './Track.css';

const statusColors = {
  open: '#e53935',
  in_progress: '#f57c00',
  resolved: '#2e7d32',
  closed: '#757575',
};

const priorityColors = {
  high: '#e53935',
  medium: '#f57c00',
  low: '#2e7d32',
};

const getProgress = (status) => {
  if (status === 'open') return 25;
  if (status === 'in_progress') return 50;
  if (status === 'resolved' || status === 'closed') return 100;
  return 0;
};

const TrackStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrievances(page);
  }, [page]);

  const fetchGrievances = async (pageNum) => {
    try {
      setLoading(true);
      const response = await grievanceService.getUserGrievances?.(pageNum, 10);
      setGrievances(response?.data?.data || []);
      setTotalPages(response?.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      const found = grievances.find(g => g.id.toString() === searchId);
      if (found) {
        navigate(`/citizen/grievance/${found.id}`);
      } else {
        alert('Grievance not found');
      }
    }
  };

  return (
    <RedesignedMainLayout role="citizen">
      <div className="track-page">
        {/* Page Header */}
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '28px', fontWeight: 500 }}>📍 Track Your Complaint Status</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Monitor your grievances and get real-time updates</p>
        </div>

        {/* Search Box */}
        <div className="track-search-box">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 600 }}>🔍 Quick Complaint Search</h3>
          <form onSubmit={handleSearch}>
            <div className="track-search-row">
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g., 123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button type="submit">🔍 Search</button>
            </div>
          </form>
        </div>

        {/* Complaints Section */}
        {loading ? (
          <div className="track-empty">Loading your complaints...</div>
        ) : grievances.length === 0 ? (
          <div className="track-empty">
            <p style={{ margin: 0 }}>You haven't filed any complaints yet.</p>
            <button onClick={() => navigate('/citizen/raise-grievance')}>
              File Your First Complaint
            </button>
          </div>
        ) : (
          <>
            <div className="track-grid">
              {grievances.map(g => {
                const progress = getProgress(g.status);
                const statusColor = statusColors[g.status] || '#757575';
                const priorityColor = priorityColors[g.priority] || '#757575';
                return (
                  <div
                    key={g.id}
                    className="track-card"
                    onClick={() => navigate(`/citizen/grievance/${g.id}`)}
                  >
                    <div className="track-card-header">
                      <div>
                        <div className="track-card-id">Complaint #{g.id}</div>
                        <div className="track-card-title">{g.title}</div>
                      </div>
                      <span className="track-badge" style={{ background: statusColor }}>
                        {g.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="track-progress-wrap">
                      <div className="track-progress-label">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="track-progress-bar">
                        <div
                          className="track-progress-fill"
                          style={{ width: `${progress}%`, background: statusColor }}
                        />
                      </div>
                    </div>

                    <div className="track-card-meta">
                      <div>
                        <div className="track-meta-label">Category</div>
                        <div className="track-meta-value">{g.category_name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="track-meta-label">Priority</div>
                        <span className="track-badge" style={{ background: priorityColor }}>
                          {g.priority?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                      {g.assigned_staff_name && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div className="track-meta-label">Assigned To</div>
                          <div className="track-meta-value">{g.assigned_staff_name}</div>
                        </div>
                      )}
                    </div>

                    <div className="track-card-footer">
                      <span>Filed: {g.created_at ? new Date(g.created_at).toLocaleDateString() : 'N/A'}</span>
                      <button className="track-view-btn">View Details →</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="track-pagination">
                <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={p === page ? 'active' : ''}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="track-info-box">
          <h3>📌 How to Track Your Complaint</h3>
          <ul>
            <li><strong>Open:</strong> Your complaint has been received and is waiting for review</li>
            <li><strong>In Progress:</strong> Our staff is actively working on resolving your complaint</li>
            <li><strong>Resolved:</strong> Your complaint has been resolved and is awaiting closure</li>
            <li><strong>Closed:</strong> Your complaint has been successfully closed</li>
          </ul>
        </div>
      </div>
    </RedesignedMainLayout>
  );
};

export default TrackStatus;
