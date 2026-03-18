import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComplaintPage.css';

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/complaints', newComplaint);
      setNewComplaint({ title: '', description: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  return (
    <div className="complaint-page">
      <h1 className="page-title">Complaints</h1>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="title"
          placeholder="Enter complaint title"
          value={newComplaint.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          className="form-textarea"
          name="description"
          placeholder="Enter complaint description"
          value={newComplaint.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <button className="form-button" type="submit">Submit</button>
      </form>
      <ul className="complaint-list">
        {complaints.map((complaint) => (
          <li className="complaint-item" key={complaint.id}>
            <h3 className="complaint-title">{complaint.title}</h3>
            <p className="complaint-description">{complaint.description}</p>
            <p className="complaint-status">Status: {complaint.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintPage;