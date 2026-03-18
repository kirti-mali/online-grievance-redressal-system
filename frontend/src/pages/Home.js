import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as categoryService from '../services/categoryService';
import * as grievanceService from '../services/grievanceService';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoryService.getAllCategories()
      .then(res => {
        const list = res.data?.data || res.data?.categories || [];
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...selected]);
  };

  const handleRemoveFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!formData.title.trim()) return setFormError('Title is required');
    if (!formData.description.trim() || formData.description.length < 20)
      return setFormError('Description must be at least 20 characters');
    if (!formData.category_id) return setFormError('Please select a category');

    setSubmitting(true);
    try {
      const res = await grievanceService.createGrievance({
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        priority: formData.priority,
      });

      if (res.data.success) {
        const id = res.data.grievance.id;
        for (const file of files) {
          const fd = new FormData();
          fd.append('file', file);
          try { await grievanceService.uploadDocument(id, fd); } catch (_) {}
        }
        setFormSuccess(`✅ Complaint submitted! ID: ${id}`);
        setFormData({ title: '', description: '', category_id: '', priority: 'medium' });
        setFiles([]);
        setTimeout(() => navigate('/citizen/my-grievances'), 2000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="home-container">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Online Grievance Redressal System</h1>
            <p>A modern platform for citizens to lodge, track, and resolve complaints efficiently</p>
            {!isAuthenticated && (
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="hero-buttons">
                <Link to={`/${user.role}/dashboard`} className="btn btn-primary">Go to Dashboard</Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <div className="hero-illustration"><span>📋</span></div>
          </div>
        </section>

        {/* Quick Complaint Form Section */}
        <section className="quick-complaint-section">
          <div className="quick-complaint-wrapper">
            <div className="quick-complaint-info">
              <h2>📝 Submit a Complaint</h2>
              <p>Fill in the form to quickly submit your grievance. Our team will review and respond promptly.</p>
              <ul className="complaint-benefits">
                <li>✅ Track your complaint in real-time</li>
                <li>✅ Get email & SMS notifications</li>
                <li>✅ Attach supporting documents</li>
                <li>✅ Rate the resolution</li>
              </ul>
              {!isAuthenticated && (
                <div className="login-notice">
                  <span>⚠️ You need to </span>
                  <Link to="/login">login</Link>
                  <span> or </span>
                  <Link to="/register">register</Link>
                  <span> to submit a complaint.</span>
                </div>
              )}
            </div>

            <div className="quick-complaint-form-box">
              {formError && <div className="error-banner">{formError}</div>}
              {formSuccess && <div className="success-banner">{formSuccess}</div>}

              <form onSubmit={handleSubmit} className="quick-form">
                <div className="qf-group">
                  <label>Complaint Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief title of your complaint"
                    maxLength="255"
                    required
                  />
                </div>

                <div className="qf-row">
                  <div className="qf-group">
                    <label>Category *</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                      <option value="">-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="qf-group">
                    <label>Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency 🚨</option>
                    </select>
                  </div>
                </div>

                <div className="qf-group">
                  <label>Description * (min 20 chars)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your complaint in detail..."
                    rows="5"
                    minLength="20"
                    maxLength="2000"
                    required
                  />
                  <small>{formData.description.length}/2000</small>
                </div>

                <div className="qf-group">
                  <label>📎 Attach Files (optional)</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  />
                  <small>PDF, JPG, PNG, DOC, TXT — Max 10MB each</small>
                </div>

                {files.length > 0 && (
                  <div className="qf-files">
                    {files.map((f, i) => (
                      <div key={i} className="qf-file-item">
                        <span>📄 {f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                        <button type="button" onClick={() => handleRemoveFile(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" className="qf-submit-btn" disabled={submitting}>
                  {submitting ? '⏳ Submitting...' : '🚀 Submit Complaint'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works-section">
          <h2>How It Works</h2>
          <p className="section-subtitle">File and resolve your grievances in 4 simple steps</p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Register & Login</h3>
              <p>Create your account and choose your role to get started.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">📋</div>
              <h3>Submit Complaint</h3>
              <p>Fill the form, select category, priority, and attach documents.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🔍</div>
              <h3>Track Progress</h3>
              <p>Monitor your complaint status in real-time with notifications.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">✅</div>
              <h3>Get Resolution</h3>
              <p>Receive resolution from staff and provide your feedback.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            {[
              { icon: '📎', title: 'File Upload', desc: 'Attach PDF, images, and documents as proof.' },
              { icon: '🔔', title: 'Notifications', desc: 'Email & SMS alerts on every status update.' },
              { icon: '⭐', title: 'Feedback & Ratings', desc: 'Rate the service after resolution.' },
              { icon: '📊', title: 'Analytics', desc: 'Reports and charts for admins.' },
              { icon: '🔒', title: 'Secure Login', desc: 'JWT auth with role-based access control.' },
              { icon: '📍', title: 'Location', desc: 'GPS auto-detect or manual district/taluk entry.' },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-box"><div className="stat-number">10K+</div><div className="stat-label">Grievances Resolved</div></div>
            <div className="stat-box"><div className="stat-number">500+</div><div className="stat-label">Active Users</div></div>
            <div className="stat-box"><div className="stat-number">98%</div><div className="stat-label">Satisfaction Rate</div></div>
            <div className="stat-box"><div className="stat-number">24/7</div><div className="stat-label">Portal Availability</div></div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Get Started Today</h2>
          <p>Join thousands of citizens who have resolved their grievances through our platform</p>
          {!isAuthenticated
            ? <Link to="/register" className="btn btn-primary btn-lg">Register Now</Link>
            : <Link to={`/${user.role}/dashboard`} className="btn btn-primary btn-lg">Go to Dashboard</Link>
          }
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Home;
