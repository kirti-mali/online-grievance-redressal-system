import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Protective Route
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Complaints from './pages/Complaints';
import ComplaintPage from './pages/ComplaintPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import RaiseGrievance from './pages/citizen/RaiseGrievance';
import MyGrievances from './pages/citizen/MyGrievances';
import GrievanceDetail from './pages/citizen/GrievanceDetail';
import UserProfile from './pages/user/Profile';

// New Citizen Components
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import ComplaintTracker from './pages/citizen/ComplaintTracker';
import MyGrievancesEnhanced from './pages/citizen/MyGrievancesEnhanced';
import Track from './pages/citizen/Track';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffGrievances from './pages/staff/Grievances';
import ResolutionHistory from './pages/staff/ResolutionHistory';
import Performance from './pages/staff/Performance';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageGrievances from './pages/admin/ManageGrievances';
import ManageCategories from './pages/admin/ManageCategories';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// New Admin Components
import AdminManageComplaints from './pages/admin/AdminManageComplaints';
import ComplaintHistory from './pages/admin/ComplaintHistory';

// Settings Page
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// Styles
import './styles/App.css';
import './styles/Complaints.css';

const App = () => {
  return (
    <Router>
      <LanguageProvider>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route Fallback */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* General Complaints Route */}
          <Route 
            path="/complaints" 
            element={
              <ProtectedRoute>
                <ComplaintPage />
              </ProtectedRoute>
            } 
          />

          {/* Citizen Routes */}
          <Route 
            path="/citizen/dashboard" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/raise-grievance" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <RaiseGrievance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/my-grievances" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <MyGrievances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/grievance/:id" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <GrievanceDetail />
              </ProtectedRoute>
            } 
          />

          {/* New Citizen Routes */}
          <Route 
            path="/citizen/submit-complaint" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <SubmitComplaint />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/complaint/:complainId" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <ComplaintTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/my-complaints" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <MyGrievancesEnhanced />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/track" 
            element={
              <ProtectedRoute requiredRoles={['citizen']}>
                <Track />
              </ProtectedRoute>
            } 
          />

          {/* Staff Routes */}
          <Route 
            path="/staff/dashboard" 
            element={
              <ProtectedRoute requiredRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/grievances" 
            element={
              <ProtectedRoute requiredRoles={['staff']}>
                <StaffGrievances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/resolutions" 
            element={
              <ProtectedRoute requiredRoles={['staff']}>
                <ResolutionHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/performance" 
            element={
              <ProtectedRoute requiredRoles={['staff']}>
                <Performance />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/grievances" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ManageGrievances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ManageCategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />

          {/* New Admin Routes */}
          <Route 
            path="/admin/manage-complaints" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminManageComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/complaint-history" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ComplaintHistory />
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />

          {/* Settings - Available to all authenticated users */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
