// src/pages/ForgetPasswordPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Assuming the path to the component
import ForgetPasswordForm from '../components/ForgetPasswordForm'; 

function ForgetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* App Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Reeyo
          </h1>
          <p className="mt-2 text-gray-500 text-lg font-medium">Password Recovery</p>
        </div>

        {/* The reusable form component */}
        <ForgetPasswordForm />
        
      </motion.div>
    </div>
  );
}

export default ForgetPasswordPage;

