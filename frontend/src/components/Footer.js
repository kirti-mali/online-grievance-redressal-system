import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      paddingTop: '3rem',
      paddingBottom: '1rem'
    }}>
      <Container>
        <Row className="mb-4">
          <Col md={3} className="mb-4">
            <h5 className="fw-bold">📋 GRS System</h5>
            <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>
              Online Grievance Redressal System is a digital platform for 
              citizens to lodge and track complaints efficiently.
            </p>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
              <li><a href="#about" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
              <li><a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li>
              <li><a href="#privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              📧 info@grs.com
            </p>
            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              📞 +1 (555) 123-4567
            </p>
            <p style={{ fontSize: '0.95rem' }}>
              📍 123 Main Street, City
            </p>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Follow Us</h5>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#facebook" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>f</a>
              <a href="#twitter" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>𝕏</a>
              <a href="#linkedin" style={{ color: 'white', fontSize: '1.2rem', textDecoration: 'none' }}>in</a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        <Row>
          <Col className="text-center" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            <p>&copy; {currentYear} Online Grievance Redressal System. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
