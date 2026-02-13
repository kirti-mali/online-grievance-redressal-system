import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children, hasSidebar = false, role = '' }) => {
  return (
    <div className="layout">
      <Header />
      
      <div className="layout-container">
        {hasSidebar && <aside className="layout-sidebar" />}
        <main className={`layout-main ${hasSidebar ? 'with-sidebar' : ''}`}>
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
