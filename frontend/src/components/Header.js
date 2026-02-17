import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-custom sticky-top shadow-sm" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: 'white' }}>
          📋 GRS System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              {user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" style={{ color: 'white' }}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/users" style={{ color: 'white' }}>
                    Users
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/grievances" style={{ color: 'white' }}>
                    Grievances
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/categories" style={{ color: 'white' }}>
                    Categories
                  </Nav.Link>
                </>
              )}
              {user?.role === 'staff' && (
                <>
                  <Nav.Link as={Link} to="/staff/dashboard" style={{ color: 'white' }}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/staff/grievances" style={{ color: 'white' }}>
                    My Tasks
                  </Nav.Link>
                </>
              )}
              {user?.role === 'citizen' && (
                <>
                  <Nav.Link as={Link} to="/citizen/dashboard" style={{ color: 'white' }}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/citizen/raise-grievance" style={{ color: 'white' }}>
                    File Complaint
                  </Nav.Link>
                </>
              )}
            </Nav>
          )}
          
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/" style={{ color: 'white', fontWeight: '500' }}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" style={{ color: 'white', fontWeight: '500' }}>
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/contact" style={{ color: 'white', fontWeight: '500' }}>
                  Contact
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ color: 'white', fontWeight: '500' }}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ color: 'white', fontWeight: '500' }}>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <span style={{ color: 'white', fontSize: '0.95rem' }}>
                  {user?.name}
                </span>
                <span className="badge bg-light text-dark">
                  {user?.role.toUpperCase()}
                </span>
                
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    as={Button}
                    variant="light"
                    size="sm"
                  >
                    ⚙️
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      👤 Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} style={{ color: '#dc3545' }}>
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
