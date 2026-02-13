import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Online Grievance Redressal System</h1>
            <p>A modern platform for citizens to lodge, track, and resolve complaints efficiently</p>
            
            {!isAuthenticated && (
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <span>📋</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Easy Filing</h3>
              <p>File complaints with just a few clicks. Categorize issues and set priority levels.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Real-time Tracking</h3>
              <p>Track your grievance status in real-time. Get instant updates on progress.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Dedicated Support</h3>
              <p>Our staff members work to resolve your grievances efficiently.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Reports</h3>
              <p>Comprehensive reports and analytics for better decision making.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Resolution</h3>
              <p>Optimized workflow ensures quick resolution of grievances.</p>
            </div>
          </div>
        </section>

        <section className="roles-section">
          <h2>For Different Users</h2>
          <div className="roles-grid">
            <div className="role-card">
              <h3>👤 Citizens</h3>
              <ul>
                <li>File new grievances</li>
                <li>Track status in real-time</li>
                <li>View resolutions</li>
                <li>Manage profile</li>
              </ul>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-primary">Register as Citizen</Link>
              )}
            </div>

            <div className="role-card">
              <h3>👷 Staff</h3>
              <ul>
                <li>View assigned grievances</li>
                <li>Add resolution notes</li>
                <li>Update grievance status</li>
                <li>Track performance</li>
              </ul>
            </div>

            <div className="role-card">
              <h3>🔑 Admin</h3>
              <ul>
                <li>Manage users</li>
                <li>Assign grievances</li>
                <li>View reports & analytics</li>
                <li>Manage categories</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Grievances Resolved</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Portal Availability</div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Get Started Today</h2>
          <p>Join thousands of citizens who have used our platform to resolve their grievances</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Now
            </Link>
          )}
          {isAuthenticated && (
            <Link 
              to={`/${user.role}/dashboard`} 
              className="btn btn-primary btn-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
