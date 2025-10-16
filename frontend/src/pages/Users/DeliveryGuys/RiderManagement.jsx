// src/pages/Users/DeliveryGuys/RiderManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Ban, CheckCircle, XCircle, MapPin, Star, TrendingUp, DollarSign, Package, X, Phone, Mail, FileCheck, FileX, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// --- SIMULATED DATA & MOCK FUNCTIONS (Replaces Supabase calls) ---

const initialRiders = [
    { id: 101, name: 'Eric Njume', phone: '675112233', email: 'eric.njume@reyoo.com', vehicle_type: 'Motorcycle', status: 'Online', availability: 'Available', total_deliveries: 345, rating: 4.8, license_verified: true, vehicle_verified: true, city: 'Douala', created_at: '2023-01-01T10:00:00Z' },
    { id: 102, name: 'Aicha Kengne', phone: '699445566', email: 'aicha.kengne@reyoo.com', vehicle_type: 'Bicycle', status: 'Online', availability: 'On Delivery', total_deliveries: 150, rating: 4.5, license_verified: true, vehicle_verified: false, city: 'Yaounde', created_at: '2023-03-15T11:30:00Z' },
    { id: 103, name: 'Pierre Eto', phone: '655778899', email: 'pierre.eto@reyoo.com', vehicle_type: 'Car', status: 'Offline', availability: 'Not Available', total_deliveries: 890, rating: 4.9, license_verified: true, vehicle_verified: true, city: 'Douala', created_at: '2022-09-20T15:45:00Z' },
    { id: 104, name: 'Sarah Mboh', phone: '688001122', email: 'sarah.mboh@reyoo.com', vehicle_type: 'Motorcycle', status: 'Offline', availability: 'Not Available', total_deliveries: 12, rating: 3.2, license_verified: false, vehicle_verified: false, city: 'Buea', created_at: '2024-05-10T08:00:00Z' },
];

let mockRiders = [...initialRiders];

const simulateFetchRiders = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockRiders), 800);
    });
};

const simulateFetchRiderEarnings = (riderId) => {
    // Mock earnings data for the modal (based on rider ID)
    const earningsMap = {
        101: [
            { id: 'e001', delivery_id: 'd-20240501-A1', amount: 1500, created_at: '2024-05-01' },
            { id: 'e002', delivery_id: 'd-20240501-A2', amount: 2000, created_at: '2024-05-01' },
            { id: 'e003', delivery_id: 'd-20240430-B1', amount: 1800, created_at: '2024-04-30' },
        ],
        102: [
            { id: 'e004', delivery_id: 'd-20240502-C1', amount: 1200, created_at: '2024-05-02' },
            { id: 'e005', delivery_id: 'd-20240502-C2', amount: 1400, created_at: '2024-05-02' },
        ],
        103: [], // Offline rider, few recent earnings
        104: [
            { id: 'e006', delivery_id: 'd-20240505-D1', amount: 1000, created_at: '2024-05-05' },
        ]
    };
    
    return new Promise(resolve => {
        setTimeout(() => resolve(earningsMap[riderId] || []), 500);
    });
};

// --- RIDER MANAGEMENT COMPONENT ---
function RiderManagement() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRider, setSelectedRider] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [riderEarnings, setRiderEarnings] = useState([]);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    setLoading(true);
    try {
      // Simulate fetch and sorting
      const data = await simulateFetchRiders();
      setRiders(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []);
    } catch (error) {
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderEarnings = async (riderId) => {
    try {
      const data = await simulateFetchRiderEarnings(riderId);
      setRiderEarnings(data || []);
    } catch (error) {
      console.error('Error fetching rider earnings:', error);
    }
  };

  const handleViewDetails = async (rider) => {
    setSelectedRider(rider);
    setShowDetailsModal(true);
    await fetchRiderEarnings(rider.id);
  };

  const handleToggleVerification = (riderId, field, currentValue) => {
    // Mock update: update local state for immediate feedback
    mockRiders = mockRiders.map(r => 
        r.id === riderId ? { ...r, [field]: !currentValue } : r
    );
    fetchRiders(); // Re-fetch from mock data
    if (selectedRider?.id === riderId) {
        setSelectedRider(prev => ({ ...prev, [field]: !currentValue }));
    }
  };

  const handleUpdateStatus = (riderId, newStatus) => {
    // Mock update: update local state for immediate feedback
    mockRiders = mockRiders.map(r => 
        r.id === riderId ? { ...r, status: newStatus } : r
    );
    fetchRiders();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Vehicle Type', 'Status', 'Total Deliveries', 'Rating', 'City'];
    const rows = filteredRiders.map(r => [
      r.name, r.phone, r.email, r.vehicle_type, r.status, r.total_deliveries, r.rating, r.city
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reyoo_riders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rider.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || rider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper for Status Classes
  const getStatusClasses = (status) => {
    if (status === 'Online') return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    if (status === 'Offline') return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // Helper for Availability Classes
  const getAvailabilityClasses = (availability) => {
    if (availability === 'Available') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    if (availability === 'On Delivery') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading Rider Data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Delivery Rider Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage delivery agents and monitor their performance.</p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-colors duration-300">
        
        {/* Toolbar: Search, Filter, Export */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <motion.button
            onClick={exportToCSV}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Verified Docs</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRiders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-white">{rider.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{rider.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{rider.vehicle_type || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(rider.status)}`}>
                      {rider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityClasses(rider.availability)}`}>
                      {rider.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-800 dark:text-white">{parseFloat(rider.rating).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                        {rider.license_verified && <span className="w-2 h-2 bg-green-500 rounded-full" title="License Verified"></span>}
                        {rider.vehicle_verified && <span className="w-2 h-2 bg-blue-500 rounded-full" title="Vehicle Verified"></span>}
                        {!rider.license_verified && !rider.vehicle_verified && <span className="text-xs text-gray-400 dark:text-gray-500">None</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(rider)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(rider.id, rider.status === 'Online' ? 'Offline' : 'Online')}
                        className={`p-2 rounded-lg transition-colors ${
                          rider.status === 'Online'
                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-gray-700'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-gray-700'
                        }`}
                        title={rider.status === 'Online' ? 'Set Offline' : 'Set Online'}
                      >
                        {rider.status === 'Online' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRiders.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No riders found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* --- Details Modal --- */}
      {showDetailsModal && selectedRider && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Rider Details: {selectedRider.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Personal & Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Personal & Contact</h3>
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-800 dark:text-white text-lg">{selectedRider.name}</p>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{selectedRider.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>{selectedRider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{selectedRider.city || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Vehicle & Documents</h3>
                  <div className="space-y-3">
                    <p className="font-medium text-gray-800 dark:text-white">Vehicle Type: <span className="text-blue-600 dark:text-blue-400">{selectedRider.vehicle_type || 'N/A'}</span></p>

                    {/* License Verification */}
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">License Verification Status</p>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {selectedRider.license_verified ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400"><FileCheck className="w-5 h-5" /><span className="font-medium">Verified</span></div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400"><FileX className="w-5 h-5" /><span className="font-medium">Not Verified</span></div>
                            )}
                            <button
                                onClick={() => handleToggleVerification(selectedRider.id, 'license_verified', selectedRider.license_verified)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                            >
                                {selectedRider.license_verified ? 'Revoke' : 'Verify'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Vehicle Verification */}
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vehicle Verification Status</p>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {selectedRider.vehicle_verified ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400"><FileCheck className="w-5 h-5" /><span className="font-medium">Verified</span></div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400"><FileX className="w-5 h-5" /><span className="font-medium">Not Verified</span></div>
                            )}
                            <button
                                onClick={() => handleToggleVerification(selectedRider.id, 'vehicle_verified', selectedRider.vehicle_verified)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                            >
                                {selectedRider.vehicle_verified ? 'Revoke' : 'Verify'}
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/40 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Deliveries</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedRider.total_deliveries}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{parseFloat(selectedRider.rating).toFixed(1)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Earnings</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {riderEarnings.reduce((sum, e) => sum + parseFloat(e.amount), 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Earnings History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Recent Earnings History</h3>
                {riderEarnings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Delivery ID</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Amount (XAF)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {riderEarnings.slice(0, 5).map((earning) => (
                          <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(earning.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {earning.delivery_id.slice(0, 8)}...
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                              {parseFloat(earning.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No recent earnings history available.</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Export the named function at the bottom
export default RiderManagement;

