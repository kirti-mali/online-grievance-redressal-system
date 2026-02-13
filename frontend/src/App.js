import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Protective Route
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import RaiseGrievance from './pages/citizen/RaiseGrievance';
import MyGrievances from './pages/citizen/MyGrievances';
import GrievanceDetail from './pages/citizen/GrievanceDetail';
import UserProfile from './pages/user/Profile';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffGrievances from './pages/staff/Grievances';
import ResolutionHistory from './pages/staff/ResolutionHistory';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageGrievances from './pages/admin/ManageGrievances';
import ManageCategories from './pages/admin/ManageCategories';
import Reports from './pages/admin/Reports';

// Styles
import './styles/App.css';

const App = () => {
  return (
    <Router>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route Fallback */}
          <Route path="/unauthorized" element={<Unauthorized />} />

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

          {/* User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
