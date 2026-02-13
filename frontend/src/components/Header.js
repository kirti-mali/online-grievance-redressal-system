import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>GRS</h1>
        </Link>

        <nav className={`header-nav ${showMenu ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="nav-links">
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/categories">Categories</Link>
                  </>
                )}
                {user?.role === 'staff' && (
                  <>
                    <Link to="/staff/dashboard">Staff Dashboard</Link>
                    <Link to="/staff/grievances">My Grievances</Link>
                  </>
                )}
                {user?.role === 'citizen' && (
                  <>
                    <Link to="/citizen/dashboard">Dashboard</Link>
                    <Link to="/citizen/raise-grievance">Raise Grievance</Link>
                    <Link to="/citizen/my-grievances">My Grievances</Link>
                  </>
                )}
              </div>

              <div className="nav-user">
                <span className="nav-username">{user?.name}</span>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button className="nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>

        <button 
          className="header-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
