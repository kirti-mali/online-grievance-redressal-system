import React from 'react';
import './PrintComplaint.css';

const PrintComplaint = ({ complaint, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-modal">
      <div className="print-modal-content">
        <div className="print-header no-print">
          <h3>Print Complaint</h3>
          <div className="print-actions">
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        <div className="printable-content" id="printable-area">
          <div className="print-document">
            <div className="document-header">
              <h1>Online Grievance Redressal System</h1>
              <h2>Complaint Details</h2>
              <div className="document-meta">
                <p>Complaint ID: <strong>#{complaint.id}</strong></p>
                <p>Date: <strong>{new Date(complaint.created_at).toLocaleDateString()}</strong></p>
              </div>
            </div>

            <div className="document-section">
              <h3>Complaint Information</h3>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Title:</td>
                    <td className="value">{complaint.title}</td>
                  </tr>
                  <tr>
                    <td className="label">Category:</td>
                    <td className="value">{complaint.category_name}</td>
                  </tr>
                  <tr>
                    <td className="label">Status:</td>
                    <td className="value">{complaint.status?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td className="label">Priority:</td>
                    <td className="value">{complaint.priority?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td className="label">Submitted By:</td>
                    <td className="value">{complaint.user_name}</td>
                  </tr>
                  <tr>
                    <td className="label">Assigned To:</td>
                    <td className="value">{complaint.assigned_staff_name || 'Not Assigned'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="document-section">
              <h3>Description</h3>
              <div className="description-box">
                {complaint.description}
              </div>
            </div>

            {complaint.resolution && (
              <div className="document-section">
                <h3>Resolution</h3>
                <div className="resolution-box">
                  {complaint.resolution}
                </div>
              </div>
            )}

            <div className="document-footer">
              <p>This is an official document from the Online Grievance Redressal System</p>
              <p>Generated on: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintComplaint;
