import React from 'react';
import './MainLayout.css';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children, hasSidebar = false, role = '' }) => {
  return (
    <div className="layout">
      
      <div className="layout-container">
        {hasSidebar && <Sidebar role={role} />}
        <main className={`layout-main ${hasSidebar ? 'with-sidebar' : ''}`}>
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
