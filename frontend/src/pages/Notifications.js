import React, { useState, useEffect } from 'react';
import RedesignedMainLayout from '../layouts/RedesignedMainLayout';
import apiClient from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications?limit=50');
      setNotifications(res.data.notifications || []);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notifications/all/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      toast.success('All marked as read');
    } catch { toast.error('Failed to update'); }
  };

  const markRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch {}
  };

  const role = user?.role || 'citizen';

  return (
    <RedesignedMainLayout role={role}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>🔔 Notifications</h1>
            <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Stay updated on your grievances</p>
          </div>
          {notifications.some(n => !n.is_read) && (
            <button onClick={markAllRead} style={{ background: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
              Mark All Read
            </button>
          )}
        </div>

        {loading ? <p>Loading...</p> : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5f6368', background: 'white', borderRadius: '8px', border: '1px solid #dadce0' }}>
            No notifications yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                style={{
                  background: n.is_read ? 'white' : '#e8f0fe',
                  border: `1px solid ${n.is_read ? '#dadce0' : '#1a73e8'}`,
                  borderRadius: '8px', padding: '16px', cursor: n.is_read ? 'default' : 'pointer',
                  borderLeft: n.is_read ? '4px solid #dadce0' : '4px solid #1a73e8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: n.is_read ? 400 : 700, fontSize: '15px', marginBottom: '4px' }}>{n.title}</div>
                    <div style={{ color: '#5f6368', fontSize: '13px' }}>{n.message}</div>
                  </div>
                  <div style={{ color: '#9aa0a6', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {new Date(n.created_at).toLocaleDateString()}
                  </div>
                </div>
                {!n.is_read && <div style={{ fontSize: '11px', color: '#1a73e8', marginTop: '6px', fontWeight: 600 }}>Click to mark as read</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </RedesignedMainLayout>
  );
};

export default Notifications;
