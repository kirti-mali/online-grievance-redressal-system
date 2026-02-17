import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as grievanceService from '../../services/grievanceService';
import * as categoryService from '../../services/categoryService';
import '../Auth.css';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
    attachment: null
  });

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Complaint title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Complaint description is required');
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      // Submit grievance
      const response = await grievanceService.createGrievance({
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        priority: formData.priority
      });

      if (response.data.success) {
        const grievanceId = response.data.grievance.id;

        // Upload files if any
        if (files.length > 0) {
          for (const file of files) {
            const fileData = new FormData();
            fileData.append('file', file);
            try {
              await grievanceService.uploadDocument(grievanceId, fileData);
            } catch (fileErr) {
              console.warn('File upload failed:', fileErr);
            }
          }
        }

        setSuccess('Complaint submitted successfully! Complaint ID: ' + grievanceId);
        setFormData({
          title: '',
          description: '',
          category_id: '',
          priority: 'medium',
          attachment: null
        });
        setFiles([]);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/citizen/my-grievances');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-container">
      <div className="complaint-card">
        <div className="complaint-header">
          <h2>📝 Submit New Complaint</h2>
          <p>Describe your complaint in detail to help us resolve it faster</p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="title">Complaint Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief title of your complaint"
              maxLength="255"
              required
            />
            <small>{formData.title.length}/255</small>
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed description of your complaint"
              rows="6"
              minLength="20"
              maxLength="2000"
              required
            />
            <small>{formData.description.length}/2000</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority Level</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="files">Attach Documents</label>
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              />
              <small>Accepted: PDF, JPG, PNG, DOC, DOCX, TXT (Max 10MB each)</small>
            </div>
          </div>

          {files.length > 0 && (
            <div className="files-list">
              <h4>Attached Files:</h4>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
