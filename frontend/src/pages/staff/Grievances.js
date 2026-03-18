import React, { useState, useEffect } from 'react';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as grievanceService from '../../services/grievanceService';
import apiClient from '../../services/api';
import { toast } from 'react-toastify';

const statusColors = { open: '#e53935', in_progress: '#f57c00', resolved: '#2e7d32', closed: '#757575' };
const priorityColors = { high: '#e53935', medium: '#f57c00', low: '#2e7d32' };

const StaffGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchGrievances(); }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await grievanceService.getStaffGrievances(1, 100);
      setGrievances(res.data.data || []);
    } catch {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!notes.trim()) return toast.error('Please enter resolution notes');
    setSaving(true);
    try {
      // Add resolution notes
      await apiClient.post('/resolutions', { grievance_id: selected.id, notes });
      // Update status to resolved
      await grievanceService.updateGrievanceStatus(selected.id, 'resolved');
      toast.success('Grievance resolved successfully');
      setSelected(null);
      setNotes('');
      fetchGrievances();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resolve grievance');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await grievanceService.updateGrievanceStatus(id, status);
      toast.success('Status updated');
      fetchGrievances();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <RedesignedMainLayout role="staff">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>My Assigned Grievances</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Manage and resolve grievances assigned to you</p>
        </div>

        {loading ? <p>Loading...</p> : grievances.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#5f6368' }}>
            No grievances assigned to you yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {grievances.map(g => (
              <div key={g.id} style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>#{g.id} — {g.title}</span>
                      <span style={chip(statusColors[g.status])}>{g.status?.replace('_', ' ')}</span>
                      <span style={chip(priorityColors[g.priority])}>{g.priority}</span>
                    </div>
                    <p style={{ margin: '0 0 6px', color: '#5f6368', fontSize: '13px' }}>
                      Citizen: {g.user_name} &nbsp;|&nbsp; Category: {g.category_name} &nbsp;|&nbsp; {new Date(g.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {g.status === 'open' && (
                      <button onClick={() => handleStatusUpdate(g.id, 'in_progress')} style={btnStyle('#f57c00')}>Mark In Progress</button>
                    )}
                    {g.status !== 'resolved' && g.status !== 'closed' && (
                      <button onClick={() => { setSelected(g); setNotes(''); }} style={btnStyle('#2e7d32')}>Resolve</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Resolve Grievance #{selected.id}</h2>
            <p style={{ margin: '0 0 16px', color: '#5f6368', fontSize: '14px' }}>{selected.title}</p>
            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
              <strong>Citizen:</strong> {selected.user_name}<br />
              <strong>Category:</strong> {selected.category_name}
            </div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Resolution Notes *</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Describe how the issue was resolved..."
              style={{ width: '100%', padding: '10px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setSelected(null)} style={btnStyle('#5f6368')}>Cancel</button>
              <button onClick={handleResolve} disabled={saving} style={btnStyle('#2e7d32')}>{saving ? 'Saving...' : 'Submit Resolution'}</button>
            </div>
          </div>
        </div>
      )}
    </RedesignedMainLayout>
  );
};

const chip = (bg) => ({ background: bg, color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' });
const btnStyle = (bg) => ({ background: bg, color: 'white', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 });
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: 'white', borderRadius: '10px', padding: '28px', width: '500px', maxWidth: '95vw' };

export default StaffGrievances;
