// src/components/auth/ForgetPasswordForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, RotateCcw } from 'lucide-react';

const inputVariants = {
  rest: { scale: 1, borderColor: '#e5e7eb' },
  focus: { scale: 1.01, borderColor: '#3b82f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }
};

function ForgetPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSent(false);
    setLoading(true);

    // --- Simulated Password Reset Logic ---
    setTimeout(() => {
      setLoading(false);
      
      // Basic email validation check (for demo)
      if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address.');
        return;
      }
      
      // Simulate successful request
      setIsSent(true);
      // In a real app, you would send the email here
      console.log(`Password reset link requested for: ${email}`);
    }, 1500); // 1.5 second delay
  };

  const handleReset = () => {
    setEmail('');
    setIsSent(false);
    setError('');
  };

  return (
    <div className="p-8 rounded-2xl shadow-xl border border-gray-200/50 bg-white">
      
      <AnimatePresence mode="wait">
        {isSent ? (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h3 className="text-2xl font-bold text-gray-900">Email Sent!</h3>
            <p className="text-gray-600">
              We've sent a password reset link to <span className="font-semibold text-blue-600">{email}</span>. Please check your inbox (and spam folder).
            </p>
            <button 
              onClick={handleReset}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try a different email
            </button>
          </motion.div>
        ) : (
          /* Form State */
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Your Password</h2>
            <p className="text-gray-500 text-center text-sm">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {/* Email Input */}
            <motion.div
              initial="rest"
              whileFocus="focus"
              variants={inputVariants}
              className="relative rounded-xl border-2 border-gray-200 transition-all duration-200"
            >
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 rounded-xl focus:outline-none"
              />
            </motion.div>
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                  <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                      {error}
                  </motion.p>
              )}
            </AnimatePresence>
            
            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2 py-3 rounded-xl 
                text-white font-semibold text-lg transition-all duration-300
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50'
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Back to Login Link */}
      <div className="mt-6 text-center">
        <a href="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
          &larr; Back to Login
        </a>
      </div>
    </div>
  );
}

export default ForgetPasswordForm;

