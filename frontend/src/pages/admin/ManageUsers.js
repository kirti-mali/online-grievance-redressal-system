import React, { useState, useEffect } from 'react';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as userService from '../../services/userService';
import { toast } from 'react-toastify';

const roleColor = { admin: '#e53935', staff: '#f57c00', citizen: '#1a73e8' };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers(1, 100);
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setModalMode('add');
    setSelected(null);
    setForm({ name: '', email: '', password: '', role: 'citizen', phone: '' });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setModalMode('edit');
    setSelected(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error('Name and email required');
    if (modalMode === 'add' && !form.password) return toast.error('Password required');
    setSaving(true);
    try {
      if (modalMode === 'add') {
        await userService.createUser(form);
        toast.success('User created');
      } else {
        const update = { name: form.name, email: form.email, role: form.role, phone: form.phone };
        await userService.updateUser(selected.id, update);
        toast.success('User updated');
      }
      setShowModal(false);
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <RedesignedMainLayout role="admin">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>👥 Manage Users</h1>
            <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Create, edit and manage system users</p>
          </div>
          <button onClick={openAdd} style={btn('#1a73e8')}>+ Add User</button>
        </div>

        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        {loading ? <p>Loading...</p> : (
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dadce0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  {['ID', 'Name', 'Email', 'Role', 'Phone', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#5f6368' }}>No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid #f1f3f4' }}>
                    <td style={td}>{u.id}</td>
                    <td style={td}>{u.name}</td>
                    <td style={td}>{u.email}</td>
                    <td style={td}>
                      <span style={{ background: roleColor[u.role] || '#666', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td style={td}>{u.phone || '-'}</td>
                    <td style={td}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    <td style={td}>
                      <button onClick={() => openEdit(u)} style={btn('#1a73e8', '6px 12px', '12px')}>Edit</button>
                      <button onClick={() => handleDelete(u.id)} style={{ ...btn('#e53935', '6px 12px', '12px'), marginLeft: '8px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px' }}>{modalMode === 'add' ? '➕ Add User' : '✏️ Edit User'}</h2>
            {[
              { label: 'Full Name *', key: 'name', type: 'text' },
              { label: 'Email *', key: 'email', type: 'email' },
              ...(modalMode === 'add' ? [{ label: 'Password *', key: 'password', type: 'password' }] : []),
              { label: 'Phone', key: 'phone', type: 'tel' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Role *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px' }}>
                <option value="citizen">Citizen</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={btn('#5f6368')}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btn('#1a73e8')}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </RedesignedMainLayout>
  );
};

const btn = (bg, padding = '8px 18px', fontSize = '14px') => ({
  background: bg, color: 'white', border: 'none', borderRadius: '6px',
  padding, fontSize, cursor: 'pointer', fontWeight: 500
});
const th = { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#5f6368' };
const td = { padding: '12px 16px', fontSize: '14px' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: 'white', borderRadius: '10px', padding: '28px', width: '460px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' };

export default ManageUsers;
