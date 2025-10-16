// src/pages/Users/Customers/CustomerManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Ban, CheckCircle, X, Mail, Phone, MapPin, ShoppingBag, Award, RefreshCw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- SIMULATED DATA (Replaces Supabase calls) ---

const initialCustomers = [
  { id: 1, name: 'Ama Manko', phone: '677001122', email: 'ama.manko@example.com', total_orders: 45, status: 'Active', city: 'Douala', loyalty_points: 1200, created_at: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Jean Pierre', phone: '699334455', email: 'jean.pierre@example.com', total_orders: 12, status: 'Active', city: 'Yaounde', loyalty_points: 350, created_at: '2023-05-20T11:30:00Z' },
  { id: 3, name: 'Fatima Zongo', phone: '655667788', email: 'fatima.zongo@example.com', total_orders: 89, status: 'Active', city: 'Buea', loyalty_points: 2500, created_at: '2022-11-01T15:45:00Z' },
  { id: 4, name: 'Koffi Blaise', phone: '688990011', email: 'koffi.blaise@example.com', total_orders: 5, status: 'Blocked', city: 'Limbe', loyalty_points: 50, created_at: '2024-02-10T08:00:00Z' },
  { id: 5, name: 'Patience Eko', phone: '670123456', email: 'patience.eko@example.com', total_orders: 156, status: 'Active', city: 'Douala', loyalty_points: 5000, created_at: '2022-08-25T19:20:00Z' },
  { id: 6, name: 'Marc Foe', phone: '690987654', email: 'marc.foe@example.com', total_orders: 2, status: 'Active', city: 'Yaounde', loyalty_points: 10, created_at: '2024-04-01T14:10:00Z' },
];

const simulatedDetails = {
    1: {
        orders: [
            { id: 101, created_at: '2024-05-01', vendor: { restaurant_name: 'Chez Alice BBQ' }, order_total: 12500, status: 'Delivered' },
            { id: 102, created_at: '2024-04-25', vendor: { restaurant_name: 'Fast Food Central' }, order_total: 8000, status: 'Delivered' },
        ],
        addresses: [
            { id: 201, address_line: 'Rue Foe, Quartier Bonamoussadi', city: 'Douala', is_default: true },
            { id: 202, address_line: 'Apartment 3A, Akwa', city: 'Douala', is_default: false },
        ]
    },
    4: {
        orders: [
            { id: 103, created_at: '2024-01-20', vendor: { restaurant_name: 'Sushi Hub' }, order_total: 25000, status: 'Cancelled' },
        ],
        addresses: [
            { id: 203, address_line: 'Saker Road, Mile 4', city: 'Limbe', is_default: true },
        ]
    }
};

const simulateFetchCustomers = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(initialCustomers), 800);
    });
};

const simulateFetchCustomerDetails = (customerId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const details = simulatedDetails[customerId] || { orders: [], addresses: [] };
            resolve(details);
        }, 500);
    });
};

// --- HELPER COMPONENTS FOR MODAL (Defined outside the main function) ---

const DetailItem = ({ Icon, value }) => (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <Icon className="w-4 h-4 text-indigo-500" />
        <span className="text-sm">{value}</span>
    </div>
);

const StatCard = ({ Icon, title, value, color }) => {
    const colorClasses = {
        green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    const currentClasses = colorClasses[color] || colorClasses.green;

    return (
        <div className={`p-4 rounded-lg border border-opacity-20 ${currentClasses}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5`} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

// --- CUSTOMER MANAGEMENT COMPONENT (Named function definition) ---
function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerAddresses, setCustomerAddresses] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await simulateFetchCustomers(); 
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    setCustomerOrders([]);
    setCustomerAddresses([]);
    try {
      const details = await simulateFetchCustomerDetails(customerId);

      const formattedOrders = details.orders.map(order => ({
        ...order,
        vendors: { restaurant_name: order.vendor.restaurant_name }
      }));

      setCustomerOrders(formattedOrders || []);
      setCustomerAddresses(details.addresses || []);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
    await fetchCustomerDetails(customer.id);
  };

  const handleToggleStatus = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    
    setCustomers(prevCustomers => prevCustomers.map(c => 
        c.id === customer.id ? { ...c, status: newStatus } : c
    ));

    if (selectedCustomer && selectedCustomer.id === customer.id) {
        setSelectedCustomer(prev => ({ ...prev, status: newStatus }));
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Total Orders', 'Status', 'City', 'Loyalty Points'];
    const rows = filteredCustomers.map(c => [
      c.name, c.phone, c.email, c.total_orders, c.status, c.city, c.loyalty_points
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reeyo_customers.csv';
    a.click();
    window.URL.revokeObjectURL(url); 
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" />
        <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading Customer Data...</p>
      </div>
    );
  }

  const getStatusClasses = (status) => {
    if (status === 'Active') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
    if (status === 'Blocked') {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="p-2 sm:p-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Customer Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and monitor your customer base.</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <motion.button
            onClick={exportToCSV}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-white">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-green-600">{customer.total_orders}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{customer.city || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(customer)}
                        className={`p-2 rounded-lg transition-colors ${
                          customer.status === 'Active'
                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-gray-700'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-gray-700'
                        }`}
                        title={customer.status === 'Active' ? 'Block' : 'Activate'}
                      >
                        {customer.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No customers found matching your criteria
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing <span className="font-semibold text-gray-800 dark:text-white">{filteredCustomers.length}</span> of <span className="font-semibold text-gray-800 dark:text-white">{customers.length}</span> total customers
          </div>
        </div>
      </div>

      {/* --- Details Modal --- */}
      {showDetailsModal && selectedCustomer && (
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Details: {selectedCustomer.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Personal Info & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-300 font-semibold text-lg">{selectedCustomer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedCustomer.name}</p>
                        <p className={`text-xs font-medium ${selectedCustomer.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {selectedCustomer.status}
                        </p>
                      </div>
                    </div>
                    <DetailItem Icon={Mail} value={selectedCustomer.email} />
                    <DetailItem Icon={Phone} value={selectedCustomer.phone} />
                    <DetailItem Icon={MapPin} value={selectedCustomer.city || 'Not specified'} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard Icon={ShoppingBag} title="Total Orders" value={selectedCustomer.total_orders} color="green" />
                    <StatCard Icon={Award} title="Loyalty Points" value={selectedCustomer.loyalty_points} color="orange" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                    <p><span className="font-semibold">Member since:</span> {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Saved Addresses ({customerAddresses.length})</h3>
                {customerAddresses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {customerAddresses.map((address) => (
                      <div key={address.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-800 dark:text-white">{address.address_line}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{address.city}</p>
                          {address.is_default && (
                            <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No saved addresses for this customer.</p>
                )}
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Order History ({customerOrders.length})</h3>
                {customerOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Vendor</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Amount (XAF)</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                          <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {customerOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                              {order.vendors?.restaurant_name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                              {parseFloat(order.order_total).toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 })}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs font-medium">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No recent order history found.</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// --- Export the named function at the bottom ---
export default CustomerManagement;

