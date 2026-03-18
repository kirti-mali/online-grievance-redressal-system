import React from 'react';
import Sidebar from '../components/Sidebar';
import MobileTopbar from '../components/MobileTopbar';
import './RedesignedMainLayout.css';

const RedesignedMainLayout = ({ children, role }) => {
  return (
    <div className="redesigned-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <MobileTopbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default RedesignedMainLayout;
