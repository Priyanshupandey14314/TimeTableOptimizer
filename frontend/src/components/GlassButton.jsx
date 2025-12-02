import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({ children, className = '', onClick, type = 'button', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            className={`glass-button ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default GlassButton;
