import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import * as grievanceService from '../../services/grievanceService';
import apiClient from '../../services/api';
import { toast } from 'react-toastify';

const statusColors = { open: '#e53935', in_progress: '#f57c00', resolved: '#2e7d32', closed: '#757575' };
const priorityColors = { high: '#e53935', medium: '#f57c00', low: '#2e7d32' };
const chip = (bg) => ({ background: bg, color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', display: 'inline-block' });
const section = { background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '20px', marginBottom: '16px' };
const sectionTitle = { margin: '0 0 14px', fontSize: '16px', fontWeight: 600 };

const GrievanceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const [grievance, setGrievance] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [fbComment, setFbComment] = useState('');
  const [submittingFb, setSubmittingFb] = useState(false);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [gRes, cRes, hRes, dRes] = await Promise.all([
        grievanceService.getGrievanceById(id),
        grievanceService.getComments(id),
        grievanceService.getStatusHistory(id),
        grievanceService.getDocuments(id),
      ]);
      setGrievance(gRes.data.grievance);
      setComments(cRes.data.comments || []);
      setHistory(hRes.data.data || []);
      setDocuments(dRes.data.documents || []);

      // fetch feedback if resolved/closed
      const g = gRes.data.grievance;
      if ((g.status === 'resolved' || g.status === 'closed') && user?.role === 'citizen') {
        try {
          const fbRes = await apiClient.get(`/feedback/${id}/feedback`);
          setFeedback(fbRes.data.feedback);
        } catch {}
      }
    } catch {
      toast.error('Failed to load grievance');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await grievanceService.addComment(id, { comment: newComment });
      setNewComment('');
      const cRes = await grievanceService.getComments(id);
      setComments(cRes.data.comments || []);
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmitting(false); }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFb(true);
    try {
      await apiClient.post(`/feedback/${id}/feedback`, { rating, comment: fbComment });
      toast.success('Feedback submitted!');
      setFeedback({ rating, comment: fbComment });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally { setSubmittingFb(false); }
  };

  const role = user?.role || 'citizen';
  const backPath = role === 'admin' ? '/admin/grievances' : role === 'staff' ? '/staff/grievances' : '/citizen/my-grievances';

  if (loading) return <RedesignedMainLayout role={role}><p style={{ padding: '40px' }}>Loading...</p></RedesignedMainLayout>;
  if (!grievance) return <RedesignedMainLayout role={role}><p style={{ padding: '40px' }}>Grievance not found.</p></RedesignedMainLayout>;

  const canFeedback = (grievance.status === 'resolved' || grievance.status === 'closed') && role === 'citizen' && !feedback;

  return (
    <RedesignedMainLayout role={role}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link to={backPath} style={{ color: '#1a73e8', fontSize: '14px', textDecoration: 'none' }}>← Back</Link>
        </div>

        {/* Header */}
        <div style={section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#9aa0a6', marginBottom: '4px' }}>🎫 {t('ticketId')}: #{grievance.id}</div>
              <h1 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 600 }}>{grievance.title}</h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={chip(statusColors[grievance.status])}>{grievance.status?.replace('_', ' ')}</span>
                <span style={chip(priorityColors[grievance.priority])}>{grievance.priority}</span>
                {grievance.category_name && <span style={chip('#1a73e8')}>{grievance.category_name}</span>}
              </div>
            </div>
            <div style={{ color: '#5f6368', fontSize: '13px', textAlign: 'right' }}>
              <div>Filed: {new Date(grievance.created_at).toLocaleDateString()}</div>
              {grievance.assigned_staff_name && <div>Assigned: {grievance.assigned_staff_name}</div>}
            </div>
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '15px', lineHeight: 1.6 }}>{grievance.description}</p>
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div style={section}>
            <h3 style={sectionTitle}>📎 {t('documents')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px 14px', borderRadius: '6px', fontSize: '14px' }}>
                  <span>📄 {d.original_filename}</span>
                  <a href={`http://localhost:5000/api/documents/${d.id}/download`}
                    style={{ color: '#1a73e8', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolutions */}
        {grievance.resolutions?.length > 0 && (
          <div style={section}>
            <h3 style={sectionTitle}>✅ Resolution</h3>
            {grievance.resolutions.map(r => (
              <div key={r.id} style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '6px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{r.staff_name} — {new Date(r.created_at).toLocaleDateString()}</div>
                <p style={{ margin: 0, fontSize: '14px' }}>{r.notes}</p>
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {canFeedback && (
          <div style={section}>
            <h3 style={sectionTitle}>⭐ {t('feedback')}</h3>
            <form onSubmit={handleFeedback}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{t('rating')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)}
                      style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= rating ? 1 : 0.3 }}>
                      ⭐
                    </button>
                  ))}
                  <span style={{ alignSelf: 'center', fontSize: '14px', color: '#5f6368' }}>{rating}/5</span>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{t('comment')} (optional)</label>
                <textarea value={fbComment} onChange={e => setFbComment(e.target.value)} rows={3}
                  placeholder="Share your experience..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={submittingFb}
                style={{ background: '#f57c00', color: 'white', border: 'none', borderRadius: '6px', padding: '9px 20px', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                {submittingFb ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {feedback && (
          <div style={{ ...section, background: '#fff8e1', border: '1px solid #ffe082' }}>
            <h3 style={sectionTitle}>⭐ Your Feedback</h3>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{'⭐'.repeat(feedback.rating)}</div>
            {feedback.comment && <p style={{ margin: 0, fontSize: '14px' }}>{feedback.comment}</p>}
          </div>
        )}

        {/* Status History */}
        {history.length > 0 && (
          <div style={section}>
            <h3 style={sectionTitle}>📜 {t('statusHistory')}</h3>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f3f4', fontSize: '14px', flexWrap: 'wrap' }}>
                <span style={{ color: '#5f6368', minWidth: '100px' }}>{new Date(h.created_at).toLocaleDateString()}</span>
                {h.old_status && <span style={chip(statusColors[h.old_status] || '#999')}>{h.old_status?.replace('_', ' ')}</span>}
                {h.old_status && <span style={{ color: '#5f6368' }}>→</span>}
                {h.new_status && <span style={chip(statusColors[h.new_status] || '#999')}>{h.new_status?.replace('_', ' ')}</span>}
                {h.reason && <span style={{ color: '#5f6368' }}>— {h.reason}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Comments */}
        <div style={section}>
          <h3 style={sectionTitle}>💬 {t('addComment')}</h3>
          {comments.length === 0 ? (
            <p style={{ color: '#5f6368', fontSize: '14px' }}>No comments yet.</p>
          ) : comments.map(c => (
            <div key={c.id} style={{ background: '#f8f9fa', border: '1px solid #e8eaed', borderRadius: '6px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                {c.user_name} <span style={{ fontWeight: 400, color: '#5f6368' }}>({c.user_role})</span>
                <span style={{ float: 'right', fontWeight: 400, color: '#9aa0a6' }}>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>{c.comment}</p>
            </div>
          ))}
          <form onSubmit={handleComment} style={{ marginTop: '16px' }}>
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..." rows={3}
              style={{ width: '100%', padding: '10px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '10px' }} />
            <button type="submit" disabled={submitting || !newComment.trim()}
              style={{ background: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', padding: '9px 20px', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
              {submitting ? 'Posting...' : t('postComment')}
            </button>
          </form>
        </div>
      </div>
    </RedesignedMainLayout>
  );
};

export default GrievanceDetail;
