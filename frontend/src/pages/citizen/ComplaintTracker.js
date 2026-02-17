import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as grievanceService from '../../services/grievanceService';
import * as commentService from '../../services/api';
import '../Auth.css';

const ComplaintTracker = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGrievanceDetails();
  }, [grievanceId]);

  const loadGrievanceDetails = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getGrievanceById(grievanceId);
      if (response.data.success) {
        setGrievance(response.data.grievance);
        loadStatusHistory();
        loadComments();
        loadDocuments();
      }
    } catch (err) {
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const loadStatusHistory = async () => {
    try {
      const response = await grievanceService.getStatusHistory(grievanceId);
      if (response.data.success) {
        setStatusHistory(response.data.history);
      }
    } catch (err) {
      console.error('Failed to load status history');
    }
  };

  const loadComments = async () => {
    try {
      const response = await grievanceService.getComments(grievanceId);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await grievanceService.getDocuments(grievanceId);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await grievanceService.addComment(grievanceId, {
        comment: newComment,
        is_internal: false
      });
      setNewComment('');
      loadComments();
    } catch (err) {
      setError('Failed to add comment');
    }
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

  if (loading) return <div className="loading">Loading complaint details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!grievance) return <div className="error">Complaint not found</div>;

  return (
    <div className="tracker-container">
      {/* Complaint Header */}
      <div className="complaint-header-card">
        <div className="complaint-info">
          <h1>Complaint #{grievanceId}</h1>
          <h2>{grievance.title}</h2>
          <div className="status-badge" style={{ backgroundColor: getStatusColor(grievance.status) }}>
            {grievance.status.toUpperCase()}
          </div>
        </div>
        <div className="complaint-meta">
          <div className="meta-item">
            <span className="label">Category:</span>
            <span className="value">{grievance.category_name}</span>
          </div>
          <div className="meta-item">
            <span className="label">Priority:</span>
            <span className="value" style={{ color: grievance.priority === 'high' ? '#f44336' : '#ff9800' }}>
              {grievance.priority.toUpperCase()}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">Assigned To:</span>
            <span className="value">{grievance.assigned_staff_name || 'Pending'}</span>
          </div>
          <div className="meta-item">
            <span className="label">Created:</span>
            <span className="value">{new Date(grievance.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="tracker-content">
        {/* Description */}
        <div className="section">
          <h3>📋 Description</h3>
          <p className="description">{grievance.description}</p>
        </div>

        {/* Status Timeline */}
        <div className="section">
          <h3>⏱️ Status History</h3>
          <div className="timeline">
            {statusHistory.length > 0 ? (
              statusHistory.map((entry, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: getStatusColor(entry.new_status) }}></div>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      {entry.old_status} → {entry.new_status}
                    </div>
                    <div className="timeline-date">{new Date(entry.created_at).toLocaleString()}</div>
                    {entry.reason && <div className="timeline-reason">Reason: {entry.reason}</div>}
                    <div className="timeline-user">By: {entry.changed_by_name || 'System'}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No status updates yet</p>
            )}
          </div>
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div className="section">
            <h3>📁 Attached Documents</h3>
            <div className="documents-list">
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <span className="doc-name">{doc.original_filename}</span>
                  <span className="doc-size">{(doc.file_size / 1024).toFixed(2)} KB</span>
                  <button 
                    onClick={() => grievanceService.downloadDocument(doc.id)}
                    className="download-btn"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="section">
          <h3>💬 Updates & Comments</h3>
          <div className="comments-section">
            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <strong>{comment.user_name}</strong>
                      <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <div className="comment-body">{comment.comment}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments yet</p>
            )}

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or update..."
                rows="3"
              />
              <button type="submit" disabled={!newComment.trim()}>
                Add Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracker;
