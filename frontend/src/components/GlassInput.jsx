import React from 'react';

const GlassInput = ({ label, id, className = '', ...props }) => {
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-300 ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className="glass-input w-full text-white placeholder-gray-400"
                {...props}
            />
        </div>
    );
};

export default GlassInput;
