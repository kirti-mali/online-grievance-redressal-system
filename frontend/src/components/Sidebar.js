import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../services/api';
import './Sidebar.css';

const Sidebar = ({ role = 'citizen' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout } = useContext(AuthContext);
  const { lang, changeLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    apiClient.get('/notifications/count/unread')
      .then(r => setUnreadCount(r.data.unread_count || 0))
      .catch(() => {});
  }, []);

  const navItems = {
    admin: [
      { label: t('dashboard'), path: '/admin/dashboard', icon: '🏠' },
      { label: t('manageUsers'), path: '/admin/users', icon: '👥' },
      { label: t('manageGrievances'), path: '/admin/grievances', icon: '📋' },
      { label: t('categories'), path: '/admin/categories', icon: '🏷️' },
      { label: t('reports'), path: '/admin/reports', icon: '📊' },
      { label: t('settings'), path: '/admin/settings', icon: '⚙️' },
    ],
    staff: [
      { label: t('dashboard'), path: '/staff/dashboard', icon: '🏠' },
      { label: t('myGrievances'), path: '/staff/grievances', icon: '📋' },
      { label: 'My Resolutions', path: '/staff/resolutions', icon: '✅' },
    ],
    citizen: [
      { label: t('dashboard'), path: '/citizen/dashboard', icon: '🏠' },
      { label: t('fileGrievance'), path: '/citizen/raise-grievance', icon: '➕' },
      { label: t('myGrievances'), path: '/citizen/my-grievances', icon: '📋' },
      { label: t('trackStatus'), path: '/citizen/track', icon: '📍' },
    ],
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const close = () => setIsOpen(false);
  const menuItems = navItems[role] || [];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">☰</button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>📋 GRS</h3>
          <button className="sidebar-close" onClick={close}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, i) => (
            <Link key={i} to={item.path} className={'sidebar-item' + (isActive(item.path) ? ' active' : '')} onClick={close}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div style={{ padding: '8px 20px 4px' }}>
            <div style={{ fontSize: '11px', color: '#9aa0a6', fontWeight: 600, marginBottom: '4px' }}>🌐 LANGUAGE</div>
            <select
              value={lang}
              onChange={e => changeLang(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '13px', background: 'white' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          <Link to="/notifications" className={'sidebar-item' + (location.pathname === '/notifications' ? ' active' : '')} onClick={close}>
            <span>🔔</span>
            <span>
              {t('notifications')}
              {unreadCount > 0 && (
                <span style={{ background: '#e53935', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', marginLeft: '6px', fontWeight: 700 }}>{unreadCount}</span>
              )}
            </span>
          </Link>

          <Link to="/profile" className="sidebar-item" onClick={close}><span>👤</span><span>Profile</span></Link>
          <Link to="/settings" className="sidebar-item" onClick={close}><span>⚙️</span><span>{t('settings')}</span></Link>

          <button
            className="sidebar-item"
            onClick={handleLogout}
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
          ><span>🚪</span><span>{t('logout')}</span></button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={close} />}
    </div>
  );
};

export default Sidebar;
