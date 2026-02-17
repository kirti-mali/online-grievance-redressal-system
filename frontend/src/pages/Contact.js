import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out to us anytime!</p>
        </section>

        <section className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions or need assistance? We'd love to hear from you.</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>support@grievance.gov.in</p>
                <p>info@grievance.gov.in</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Phone</h3>
                <p>Toll Free: 1800-XXX-XXXX</p>
                <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Address</h3>
                <p>Grievance Redressal Office</p>
                <p>Government Building, City</p>
              </div>

              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h3>Working Hours</h3>
                <p>Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-item">
                <h4>How long does it take to resolve a complaint?</h4>
                <p>Most complaints are resolved within 7-15 business days, depending on complexity.</p>
              </div>
              <div className="faq-item">
                <h4>Can I track my complaint status?</h4>
                <p>Yes! You can track your complaint in real-time from your dashboard.</p>
              </div>
              <div className="faq-item">
                <h4>What if I'm not satisfied with the resolution?</h4>
                <p>You can escalate your complaint to higher authorities through the escalation feature.</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitted && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent successfully.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
