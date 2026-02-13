import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import * as grievanceService from '../../services/grievanceService';
import * as categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

const RaiseGrievance = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium'
  });

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

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

    try {
      await grievanceService.createGrievance(formData);
      toast.success('Grievance filed successfully');
      navigate('/citizen/my-grievances');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to file grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="citizen" />
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Raise a New Grievance</h1>

            <div style={styles.card}>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Brief title of your grievance"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Detailed description of the issue"
                    rows="6"
                  ></textarea>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label>Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Grievance'}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => navigate(-1)}
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
  formGroup: {
    marginBottom: '1.5rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  }
};

export default RaiseGrievance;
