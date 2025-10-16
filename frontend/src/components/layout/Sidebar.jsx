// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  Bike, 
  Settings, 
  FileText, 
  DollarSign, 
  Megaphone, 
  ChevronDown, 
  X,
  Package 
} from 'lucide-react';

// Navigation Data
const sidebarNav = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Order Management', icon: FileText, path: '/orders' },
  {
    title: 'User Management',
    icon: Users,
    path: '/users',
    children: [
      { title: 'Customers', path: '/users/customers' },
      { title: 'Delivery Guys', path: '/users/delivery-guys' },
    ],
  },
  {
    title: 'Vendor Management',
    icon: Utensils,
    path: '/vendors',
    children: [
      { title: 'Vendor List', path: '/users/vendors' },
      { title: 'Menu Approvals', path: '/vendors/approvals' },
    ],
  },
  {
    title: 'Logistics',
    icon: Bike,
    path: '/logistics',
    children: [
      { title: 'Rider Live Tracker', path: '/logistics/live' },
      { title: 'Delivery Zone Setup', path: '/logistics/zones' },
    ]
  },
  { title: 'Platform Finance', icon: DollarSign, path: '/finance' },
  { title: 'System Announcements', icon: Megaphone, path: '/announcements' },
  { title: 'System Settings', icon: Settings, path: '/settings' },
];

// NavItem Component
function NavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  const linkBaseClasses = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`;
  const activeClasses = `bg-orange-500 text-white shadow-lg`;
  const inactiveClasses = `text-gray-300 hover:bg-white/10 hover:text-white`;

  const isParentActive = hasChildren && item.children.some(child => location.pathname.startsWith(child.path));

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`${linkBaseClasses} justify-between ${isParentActive ? activeClasses : inactiveClasses}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-3">
            <item.icon size={20} />
            <span className="font-medium">{item.title}</span>
          </span>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen || isParentActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {(isOpen || isParentActive) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pl-6 space-y-1 overflow-hidden"
            >
              {item.children.map((child) => (
                <NavLink 
                  key={child.path} 
                  to={child.path} 
                  className={({ isActive }) => 
                    `flex items-center py-2 px-3 text-sm rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-600 text-white font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`
                  }
                >
                  <span className="ml-3">{child.title}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink 
      to={item.path} 
      className={({ isActive }) => `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      end={item.path === '/'}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.title}</span>
      {location.pathname === item.path && (
        <span className="ml-auto w-2 h-2 bg-white rounded-full" />
      )}
    </NavLink>
  );
}

// Main Sidebar Component
function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Mobile Backdrop Overlay - Only show on mobile when open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
          fixed inset-y-0 left-0 
          w-64 z-40 
          bg-[#004B6E]
          text-white h-full 
          flex flex-col
          shadow-2xl shadow-black/50
          transform transition-transform duration-300 ease-in-out
          
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo/Header Section */}
        <div className="p-6 flex items-center justify-between flex-shrink-0 border-b border-white/10">
          <h1 className="text-3xl font-extrabold text-white">Reeyo</h1>
          <button 
            className="lg:hidden p-1 rounded-lg hover:bg-white/10" 
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarNav.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="text-xs text-gray-300">
            <p className="font-semibold">Reeyo Food Delivery</p>
            <p className="mt-1">Admin Panel v1.0 | {new Date().getFullYear()}</p>
          </div>
          
          {/* Promo Card */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="mt-4 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl cursor-pointer"
          >
            <p className="text-sm font-semibold text-white">Improve Your Sales Efficiency</p>
            <p className="text-xs text-blue-100 mt-1">
              Check out new AI tools for logistics.
            </p>
            <button className="mt-3 bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
              Start Now →
            </button>
          </motion.div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
