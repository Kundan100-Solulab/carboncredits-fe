import React from 'react';

const Alert = ({ children, className = '' }) => (
  <div className={`bg-gray-800 border border-green-500 text-green-400 p-4 mb-4 rounded-lg shadow-lg ${className}`} role="alert">
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

export { Alert, AlertDescription };