import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserService = {
  updateProfile: async (data) => {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await UserService.updateProfile(updateData);
      if (response.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role={user?.role} />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>My Profile</h1>

            <div style={styles.card}>
              <form onSubmit={handleSubmit}>
                <div style={styles.section}>
                  <h3>Basic Information</h3>
                  
                  <div style={styles.formGroup}>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      style={{ background: '#f5f5f5' }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Role</label>
                    <input
                      type="text"
                      value={user?.role}
                      disabled
                      style={{ background: '#f5f5f5' }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div style={styles.section}>
                  <h3>Change Password (Optional)</h3>

                  <div style={styles.formGroup}>
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => navigate(`/${user?.role}/dashboard`)}
                    style={{ background: '#95a5a6', color: 'white' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '2rem'
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  }
};

export default Profile;
