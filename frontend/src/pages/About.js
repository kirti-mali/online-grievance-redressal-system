import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './About.css';

const About = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        <section className="about-hero">
          <h1>About Us</h1>
          <p>Empowering citizens with a transparent and efficient grievance redressal system</p>
        </section>

        <section className="about-content">
          <div className="about-section">
            <h2>🎯 Our Mission</h2>
            <p>
              To provide a transparent, efficient, and user-friendly platform that bridges the gap 
              between citizens and government authorities, ensuring every grievance is heard and 
              resolved promptly.
            </p>
          </div>

          <div className="about-section">
            <h2>👁️ Our Vision</h2>
            <p>
              To become the most trusted and comprehensive grievance redressal system, fostering 
              accountability, transparency, and citizen satisfaction across all government services.
            </p>
          </div>

          <div className="about-section">
            <h2>💡 Why Choose Us?</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <div>
                  <h3>Transparent Process</h3>
                  <p>Track every step of your complaint resolution with complete transparency</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <h3>Quick Resolution</h3>
                  <p>Optimized workflow ensures faster processing and resolution of grievances</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your data is protected with enterprise-grade security measures</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div>
                  <h3>Easy to Use</h3>
                  <p>Simple and intuitive interface accessible from any device</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>📊 Our Impact</h2>
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-number">10,000+</div>
                <div className="impact-label">Grievances Resolved</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">500+</div>
                <div className="impact-label">Active Users</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">98%</div>
                <div className="impact-label">Satisfaction Rate</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">24/7</div>
                <div className="impact-label">System Availability</div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>🤝 How We Work</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-num">1</div>
                <h3>Submit Your Complaint</h3>
                <p>Citizens can easily submit their grievances through our online portal</p>
              </div>
              <div className="process-step">
                <div className="step-num">2</div>
                <h3>Automatic Assignment</h3>
                <p>Complaints are automatically assigned to relevant departments and staff</p>
              </div>
              <div className="process-step">
                <div className="step-num">3</div>
                <h3>Investigation & Action</h3>
                <p>Our dedicated staff investigates and takes necessary action</p>
              </div>
              <div className="process-step">
                <div className="step-num">4</div>
                <h3>Resolution & Feedback</h3>
                <p>Complaints are resolved and citizens can provide feedback</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>🌟 Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Transparency</h3>
                <p>Open and clear communication at every step</p>
              </div>
              <div className="value-card">
                <h3>Accountability</h3>
                <p>Taking responsibility for every grievance</p>
              </div>
              <div className="value-card">
                <h3>Efficiency</h3>
                <p>Quick and effective resolution process</p>
              </div>
              <div className="value-card">
                <h3>Integrity</h3>
                <p>Honest and ethical handling of all complaints</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
