import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as grievanceService from '../../services/grievanceService';
import * as categoryService from '../../services/categoryService';
import '../../styles/SubmitComplaint.css';

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
    attachment: null,
    district: '',
    taluk: '',
    ward: '',
    latitude: null,
    longitude: null,
    location_address: ''
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Indian districts data (sample - can be expanded)
  const districts = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const taluks = {
    'Mumbai': ['Mumbai City', 'Mumbai Suburban', 'Thane'],
    'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Bangalore': ['Bangalore North', 'Bangalore South', 'Bangalore East', 'Bangalore Rural'],
    'Hyderabad': ['Hyderabad Central', 'Hyderabad North', 'Hyderabad South'],
    'Chennai': ['Chennai North', 'Chennai South', 'Chennai Central'],
    'Kolkata': ['Kolkata North', 'Kolkata South', 'Kolkata Central'],
    'Pune': ['Pune City', 'Haveli', 'Mulshi', 'Bhor'],
    'Ahmedabad': ['Ahmedabad City', 'Ahmedabad Rural', 'Daskroi'],
    'Jaipur': ['Jaipur City', 'Jaipur Rural', 'Amber'],
    'Lucknow': ['Lucknow Central', 'Lucknow North', 'Lucknow South']
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        // Reverse geocoding using OpenStreetMap Nominatim API (free)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          
          if (data.address) {
            setFormData(prev => ({
              ...prev,
              location_address: data.display_name,
              district: data.address.state_district || data.address.city || '',
              taluk: data.address.suburb || data.address.town || '',
              ward: data.address.neighbourhood || ''
            }));
            setSuccess('Location detected successfully!');
            setTimeout(() => setSuccess(''), 3000);
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          setFormData(prev => ({
            ...prev,
            location_address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
          }));
        }

        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        setError('Unable to retrieve your location. Please enter manually.');
        console.error('Geolocation error:', error);
      }
    );
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      console.log('Categories response:', response.data);
      if (response.data.success) {
        // Backend returns data in response.data.data
        const categoryList = response.data.data || response.data.categories || [];
        setCategories(categoryList);
        console.log('Categories loaded:', categoryList);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories. Please refresh the page.');
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
    
    // Validate file size (10MB max per file)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
            <label htmlFor="category_id">
              Category * 
              {categories.length > 0 && (
                <span style={{color: 'green', marginLeft: '10px', fontSize: '14px'}}>
                  ✓ {categories.length} categories available
                </span>
              )}
            </label>
            
            {/* Show loaded categories as a visual list */}
            {categories.length > 0 && (
              <div style={{
                background: '#e8f5e9',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                <strong>Available categories:</strong>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px'}}>
                  {categories.map(cat => (
                    <span key={cat.id} style={{
                      background: '#4caf50',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '13px'
                    }}>
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              style={{
                fontSize: '16px',
                padding: '12px',
                height: 'auto',
                lineHeight: '1.5'
              }}
            >
              <option value="">-- Select Category --</option>
              {categories && categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading categories...</option>
              )}
            </select>
            
            {categories.length === 0 && (
              <small style={{ color: 'orange', display: 'block', marginTop: '5px' }}>
                ⏳ Loading categories from server...
              </small>
            )}
            
            {formData.category_id && (
              <small style={{ color: 'green', display: 'block', marginTop: '5px' }}>
                ✓ Selected: {categories.find(c => c.id == formData.category_id)?.name}
              </small>
            )}
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
                <option value="emergency">Emergency 🚨</option>
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

          {/* Location Section */}
          <div className="location-section" style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <h4 style={{marginBottom: '1rem', color: '#333'}}>📍 Location Details</h4>
            
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={detectingLocation}
              style={{
                background: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: detectingLocation ? 'not-allowed' : 'pointer',
                marginBottom: '1rem',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {detectingLocation ? '📡 Detecting Location...' : '📍 Auto-Detect My Location (GPS)'}
            </button>

            {formData.location_address && (
              <div style={{
                background: '#d4edda',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '1rem',
                color: '#155724',
                fontSize: '14px'
              }}>
                <strong>Detected Location:</strong> {formData.location_address}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="district">District *</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select District --</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taluk">Taluk</label>
                <select
                  id="taluk"
                  name="taluk"
                  value={formData.taluk}
                  onChange={handleInputChange}
                  disabled={!formData.district}
                >
                  <option value="">-- Select Taluk --</option>
                  {formData.district && taluks[formData.district]?.map(taluk => (
                    <option key={taluk} value={taluk}>{taluk}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ward">Ward / Area</label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                placeholder="Enter ward number or area name"
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="files-list">
              <h4>📎 Attached Files ({files.length}):</h4>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx}>
                    <span className="file-info">
                      📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(idx)}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </li>
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
