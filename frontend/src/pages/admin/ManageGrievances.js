import React, { useState, useEffect } from 'react';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as grievanceService from '../../services/grievanceService';
import * as userService from '../../services/userService';
import { toast } from 'react-toastify';

const statusColors = { open: '#e53935', in_progress: '#f57c00', resolved: '#2e7d32', closed: '#757575' };
const priorityColors = { high: '#e53935', medium: '#f57c00', low: '#2e7d32' };

const ManageGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ status: '', assigned_to: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [gRes, sRes] = await Promise.all([
        grievanceService.getAllGrievances(1, 100),
        userService.getStaffUsers()
      ]);
      setGrievances(gRes.data.data || []);
      setStaff(sRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = grievances.filter(g => {
    const matchSearch = !search ||
      g.title?.toLowerCase().includes(search.toLowerCase()) ||
      g.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openModal = (g) => {
    setSelected(g);
    setForm({ status: g.status, assigned_to: g.assigned_to || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form.status !== selected.status) {
        await grievanceService.updateGrievanceStatus(selected.id, form.status);
      }
      if (form.assigned_to !== (selected.assigned_to || '')) {
        await grievanceService.assignGrievance(selected.id, form.assigned_to || null);
      }
      toast.success('Grievance updated');
      setShowModal(false);
      fetchAll();
    } catch {
      toast.error('Failed to update grievance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <RedesignedMainLayout role="admin">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>📋 Manage Grievances</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>View, assign and update all complaints</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input placeholder="Search title or citizen..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px' }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px' }}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dadce0', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  {['ID', 'Title', 'Citizen', 'Category', 'Priority', 'Status', 'Assigned To', 'Date', 'Action'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: '#5f6368' }}>No grievances found</td></tr>
                ) : filtered.map(g => (
                  <tr key={g.id} style={{ borderTop: '1px solid #f1f3f4' }}>
                    <td style={td}>#{g.id}</td>
                    <td style={{ ...td, maxWidth: '180px' }}>{g.title}</td>
                    <td style={td}>{g.user_name || '-'}</td>
                    <td style={td}>{g.category_name || '-'}</td>
                    <td style={td}>
                      <span style={badge(priorityColors[g.priority])}>{g.priority}</span>
                    </td>
                    <td style={td}>
                      <span style={badge(statusColors[g.status])}>{g.status?.replace('_', ' ')}</span>
                    </td>
                    <td style={td}>{g.assigned_staff_name || <span style={{ color: '#aaa' }}>Unassigned</span>}</td>
                    <td style={td}>{new Date(g.created_at).toLocaleDateString()}</td>
                    <td style={td}>
                      <button onClick={() => openModal(g)} style={btnStyle('#1a73e8')}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selected && (
        <div style={overlay}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Manage Grievance #{selected.id}</h2>
            <p style={{ margin: '0 0 20px', color: '#5f6368', fontSize: '14px' }}>{selected.title}</p>

            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Citizen:</strong> {selected.user_name} ({selected.user_email})</p>
              <p style={{ margin: '0 0 6px' }}><strong>Category:</strong> {selected.category_name}</p>
              <p style={{ margin: 0 }}><strong>Description:</strong> {selected.description}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Update Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Assign to Staff</label>
              <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={selectStyle}>
                <option value="">-- Unassigned --</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={btnStyle('#5f6368')}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btnStyle('#1a73e8')}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </RedesignedMainLayout>
  );
};

const badge = (bg) => ({ background: bg, color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' });
const btnStyle = (bg) => ({ background: bg, color: 'white', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 });
const th = { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#5f6368', whiteSpace: 'nowrap' };
const td = { padding: '12px 16px', fontSize: '14px', verticalAlign: 'middle' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: 'white', borderRadius: '10px', padding: '28px', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' };
const selectStyle = { width: '100%', padding: '9px 12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px' };

export default ManageGrievances;
