// src/App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded page components
const DashboardOverview = React.lazy(() => import('./pages/DashboardOverview'));
const CustomerManagement = React.lazy(() => import('./pages/Users/Customers/CustomerManagement'));
const VendorManagement = React.lazy(() => import('./pages/Users/Vendors/VendorManagement'));
const RiderManagement = React.lazy(() => import('./pages/Users/DeliveryGuys/RiderManagement'));

// Placeholder page components
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

function App() {
  return (
    <DashboardLayout>
      <Suspense 
        fallback={
          <div className="flex justify-center items-center h-screen w-full bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            <p className="ml-4 text-lg text-gray-700">Loading Reeyo's Admin...</p>
          </div>
        }
      >
        <Routes>
          {/* Main Dashboard Route */}
          <Route path="/" element={<DashboardOverview />} />

          {/* User Management Sub-Routes */}
          <Route path="/users/customers" element={<CustomerManagement />} />
          <Route path="/users/delivery-guys" element={<RiderManagement />} />
          <Route path="/users/vendors" element={<VendorManagement />} />
          
          {/* Top-Level Routes */}
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Placeholder Routes */}
          <Route path="/orders" element={<PlaceholderPage title="Order Management" />} />
          <Route path="/vendors/approvals" element={<PlaceholderPage title="Menu Approvals" />} />
          <Route path="/logistics/live" element={<PlaceholderPage title="Rider Live Tracker" />} />
          <Route path="/logistics/zones" element={<PlaceholderPage title="Delivery Zone Setup" />} />
          <Route path="/announcements" element={<PlaceholderPage title="System Announcements" />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}

export default App;

