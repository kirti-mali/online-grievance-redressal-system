import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About GRS</h4>
            <p>
              Online Grievance Redressal System is a digital platform for 
              citizens to lodge and track their complaints efficiently.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: info@grs.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Main Street, City, Country</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <button className="social-link" onClick={() => window.open('#', '_blank')}>Facebook</button>
              <button className="social-link" onClick={() => window.open('#', '_blank')}>Twitter</button>
              <button className="social-link" onClick={() => window.open('#', '_blank')}>LinkedIn</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Online Grievance Redressal System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
