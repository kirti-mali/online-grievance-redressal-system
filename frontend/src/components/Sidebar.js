import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role = 'citizen' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = {
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Manage Users', path: '/admin/users' },
      { label: 'All Grievances', path: '/admin/grievances' },
      { label: 'Categories', path: '/admin/categories' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Settings', path: '/admin/settings' }
    ],
    staff: [
      { label: 'Dashboard', path: '/staff/dashboard' },
      { label: 'My Grievances', path: '/staff/grievances' },
      { label: 'My Resolutions', path: '/staff/resolutions' },
      { label: 'Performance', path: '/staff/performance' }
    ],
    citizen: [
      { label: 'Dashboard', path: '/citizen/dashboard' },
      { label: 'Raise Grievance', path: '/citizen/raise-grievance' },
      { label: 'My Grievances', path: '/citizen/my-grievances' },
      { label: 'Track Status', path: '/citizen/track' }
    ]
  };

  const menuItems = navItems[role] || [];

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-item"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
