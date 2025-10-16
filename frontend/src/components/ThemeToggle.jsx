import React from 'react';
// ASSUMED FIX: Ensure this path is correct based on where you saved ThemeContext.jsx
// Common structure means it might be '../ThemeContext' or if you have a 'context' folder.
import { useTheme } from '../context/ThemeContext'; 
// 👇 FIX: Import AnimatePresence along with motion
import { motion, AnimatePresence } from 'framer-motion'; 
import { Sun, Moon } from 'lucide-react'; 

const ThemeToggle = () => {
    // Destructure theme and toggle function from the custom hook
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    // Defined size constants for cleaner JSX and easier maintenance
    const SWITCH_WIDTH = 'w-12';
    const SWITCH_HEIGHT = 'h-6';
    const ICON_SIZE = 14;

    return (
        <motion.button
            onClick={toggleTheme}
            // Use the established CSS classes for theme switching
            className={`p-1 rounded-full transition-colors duration-300 relative ${SWITCH_WIDTH} ${SWITCH_HEIGHT} flex items-center shrink-0 ${
                isDark ? 'bg-indigo-600' : 'bg-gray-300' // Use a lighter gray for better contrast
            }`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            whileTap={{ scale: 0.95 }}
            type="button" // Always specify type for accessibility/form safety
        >
            {/* The moving circle/icon container */}
            <motion.span
                className={`w-4 h-4 rounded-full shadow-md absolute flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-white' // Added background color for the toggle circle
                }`}
                layout // Essential for smooth framer motion transition
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                // Positional calculation: Left 3px (half padding)
                style={{ left: isDark ? 'calc(100% - 19px)' : '3px' }} 
            >
                {/* AnimatePresence now correctly imported and used for icon transitions */}
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        // Key is required for AnimatePresence to work correctly on content change
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon size={ICON_SIZE} className="text-white" /> {/* Changed icon color for dark mode toggle circle */}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun size={ICON_SIZE} className="text-yellow-500" /> {/* Changed icon color for light mode toggle circle */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.span>
        </motion.button>
    );
};

export default ThemeToggle;

