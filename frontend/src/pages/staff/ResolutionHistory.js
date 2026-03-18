import React from 'react';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

const ResolutionHistory = () => {
  return (
    <RedesignedMainLayout role="staff">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>My Resolution History</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>View your past resolutions and performance</p>
        </div>
        <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dadce0' }}>
          <p>Your resolution history will appear here...</p>
        </div>
      </div>
    </RedesignedMainLayout>
  );
};

export default ResolutionHistory;
