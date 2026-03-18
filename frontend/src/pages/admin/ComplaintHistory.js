import React, { useState, useEffect } from 'react';
import * as grievanceService from '../../services/grievanceService';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import '../Auth.css';

const ComplaintHistory = () => {
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // all, week, month

  useEffect(() => {
    loadHistory();
  }, [timeframe]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getAllGrievances();
      if (response.data.success) {
        let history = response.data.grievances;

        // Filter by timeframe
        if (timeframe !== 'all') {
          const days = timeframe === 'week' ? 7 : 30;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          history = history.filter(g => new Date(g.created_at) >= startDate);
        }

        setHistory(history);
        calculateStatistics(history);
      }
    } catch (err) {
      console.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (grievances) => {
    const stats = {
      total: grievances.length,
      open: grievances.filter(g => g.status === 'open').length,
      inProgress: grievances.filter(g => g.status === 'in_progress').length,
      resolved: grievances.filter(g => g.status === 'resolved').length,
      closed: grievances.filter(g => g.status === 'closed').length,
      highPriority: grievances.filter(g => g.priority === 'high').length,
      avgResolutionDays: calculateAvgResolutionTime(grievances)
    };
    setStatistics(stats);
  };

  const calculateAvgResolutionTime = (grievances) => {
    const resolved = grievances.filter(g => g.status === 'resolved' || g.status === 'closed');
    if (resolved.length === 0) return 0;

    const totalDays = resolved.reduce((sum, g) => {
      const created = new Date(g.created_at);
      const updated = new Date(g.updated_at);
      const days = Math.ceil((updated - created) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return (totalDays / resolved.length).toFixed(1);
  };

  return (
    <RedesignedMainLayout>
      <div className="history-container">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>📊 Complaint History & Analytics</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>View complaint activity and trends over time</p>
        </div>
        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
          <button
            className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
            onClick={() => setTimeframe('week')}
          >
            Last 7 Days
          </button>
          <button
            className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            Last 30 Days
          </button>
        </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="statistics-grid">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p className="stat-value">{statistics.total}</p>
          </div>
          <div className="stat-card">
            <h3>Open</h3>
            <p className="stat-value" style={{ color: '#ff9800' }}>{statistics.open}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-value" style={{ color: '#2196f3' }}>{statistics.inProgress}</p>
          </div>
          <div className="stat-card">
            <h3>Resolved</h3>
            <p className="stat-value" style={{ color: '#4caf50' }}>{statistics.resolved}</p>
          </div>
          <div className="stat-card">
            <h3>Closed</h3>
            <p className="stat-value" style={{ color: '#9c27b0' }}>{statistics.closed}</p>
          </div>
          <div className="stat-card">
            <h3>High Priority</h3>
            <p className="stat-value" style={{ color: '#f44336' }}>{statistics.highPriority}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Resolution Time</h3>
            <p className="stat-value">{statistics.avgResolutionDays} days</p>
          </div>
          <div className="stat-card">
            <h3>Resolution Rate</h3>
            <p className="stat-value">
              {statistics.total > 0 
                ? ((statistics.resolved + statistics.closed) / statistics.total * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      )}

      {/* History Timeline */}
      <div className="history-timeline">
        <h3>📈 Recent Activity</h3>
        {loading ? (
          <div className="loading">Loading history...</div>
        ) : history.length > 0 ? (
          <div className="timeline">
            {history.map((grievance) => (
              <div key={grievance.id} className="timeline-entry">
                <div className="timeline-marker"></div>
                <div className="timeline-info">
                  <h4>Complaint #{grievance.id}: {grievance.title}</h4>
                  <p className="timeline-details">
                    <span className="detail">📁 {grievance.category_name}</span>
                    <span className="detail">
                      📍 Status: <strong style={{ color: getStatusColor(grievance.status) }}>
                        {grievance.status.toUpperCase()}
                      </strong>
                    </span>
                    <span className="detail">
                      ⚡ Priority: <strong style={{ color: getPriorityColor(grievance.priority) }}>
                        {grievance.priority.toUpperCase()}
                      </strong>
                    </span>
                  </p>
                  <p className="timeline-date">{new Date(grievance.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No complaints found for this timeframe</p>
        )}
      </div>
    </div>
    </RedesignedMainLayout>
  );
};

const getStatusColor = (status) => {
  const colors = {
    open: '#ff9800',
    in_progress: '#2196f3',
    resolved: '#4caf50',
    closed: '#9c27b0'
  };
  return colors[status] || '#757575';
};

const getPriorityColor = (priority) => {
  const colors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  };
  return colors[priority] || '#757575';
};

export default ComplaintHistory;
