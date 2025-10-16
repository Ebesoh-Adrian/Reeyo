// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-x-hidden w-full lg:ml-64 transition-all duration-300">
        {/* Header */}
        <Header toggleSidebar={() => setIsMobileOpen(true)} />
        
        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

