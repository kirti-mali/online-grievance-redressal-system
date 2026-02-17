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

        <section className="how-it-works-section">
          <h2>How It Works - Simple 4 Steps</h2>
          <p className="section-subtitle">File and resolve your grievances in minutes</p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Register & Login</h3>
              <p>Create your account in seconds. Choose your role (Citizen, Staff, or Admin) and get started.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">📋</div>
              <h3>Submit Complaint</h3>
              <p>Fill out a simple form with your complaint details, select category, priority, and attach documents.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🔍</div>
              <h3>Track Progress</h3>
              <p>Monitor your complaint status in real-time. Get notifications on updates and staff responses.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">✅</div>
              <h3>Get Resolution</h3>
              <p>Receive resolution from our dedicated staff. Provide feedback and close the complaint.</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Comments & Discussion</h3>
              <p>Communicate with staff through comments. Add internal notes and track conversations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3>Escalation System</h3>
              <p>Escalate unresolved complaints to higher authorities with detailed reasons.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Feedback & Ratings</h3>
              <p>Rate resolved complaints and provide feedback to improve service quality.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Get instant notifications for status changes, comments, and important updates.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📎</div>
              <h3>Document Management</h3>
              <p>Upload and manage supporting documents. Download evidence and attachments anytime.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Status History</h3>
              <p>Complete audit trail of all status changes with timestamps and responsible users.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with JWT authentication and enterprise-grade security.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Responsive</h3>
              <p>Lightning-fast performance with real-time updates and smooth user experience.</p>
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
