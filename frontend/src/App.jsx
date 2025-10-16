// src/App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// New Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Lazy-loaded page components (Protected & Public)
const DashboardOverview = React.lazy(() => import('./pages/DashboardOverview'));
const CustomerManagement = React.lazy(() => import('./pages/Users/Customers/CustomerManagement'));
const VendorManagement = React.lazy(() => import('./pages/Users/Vendors/VendorManagement'));
const RiderManagement = React.lazy(() => import('./pages/Users/DeliveryGuys/RiderManagement'));

// Lazy Load Auth Pages
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage'));
const ForgetPasswordPage = React.lazy(() => import('./pages/Auth/ForgotPasswordPage'));

// --- Placeholder Components (Moved to be self-contained in App.jsx) ---

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
    <p className="text-gray-500 mt-4">Settings panel content goes here.</p>
  </div>
);

const FinancePage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Finance</h1>
    <p className="text-gray-500 mt-4">Finance reports page content.</p>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-500 mt-4">Content for the {title} page.</p>
  </div>
);

// --- Loading Fallback Component ---

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
    <p className="ml-4 text-lg text-gray-700">Loading Reeyo's Admin...</p>
  </div>
);

// --- Main App Component ---

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        
        {/* ======================= PUBLIC ROUTES (No Layout) ======================= */}
        
        {/* The first route should be the LoginPage, and if the user is already 
            logged in, we redirect them to the dashboard */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgetPasswordPage />} 
        />

        {/* ======================= PROTECTED ROUTES (Requires Layout) ======================= */}

        {/* Main Dashboard Route */}
        <Route path="/" element={<ProtectedRoute element={DashboardOverview} />} />

        {/* User Management Sub-Routes */}
        <Route path="/users/customers" element={<ProtectedRoute element={CustomerManagement} />} />
        <Route path="/users/delivery-guys" element={<ProtectedRoute element={RiderManagement} />} />
        <Route path="/users/vendors" element={<ProtectedRoute element={VendorManagement} />} />
        
        {/* Top-Level Routes */}
        <Route path="/finance" element={<ProtectedRoute element={FinancePage} />} />
        <Route path="/settings" element={<ProtectedRoute element={SettingsPage} />} />
        
        {/* Placeholder Routes */}
        <Route path="/orders" element={<ProtectedRoute element={() => <PlaceholderPage title="Order Management" />} />} />
        <Route path="/vendors/approvals" element={<ProtectedRoute element={() => <PlaceholderPage title="Menu Approvals" />} />} />
        <Route path="/logistics/live" element={<ProtectedRoute element={() => <PlaceholderPage title="Rider Live Tracker" />} />} />
        <Route path="/logistics/zones" element={<ProtectedRoute element={() => <PlaceholderPage title="Delivery Zone Setup" />} />} />
        <Route path="/announcements" element={<ProtectedRoute element={() => <PlaceholderPage title="System Announcements" />} />} />

        {/* Fallback route: Redirect unauthenticated users to login, others to dashboard (if not found) */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;


