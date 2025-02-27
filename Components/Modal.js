import React from 'react';

// Main Modal Component
export const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className=" rounded-lg p-4 max-w-sm w-full bg-gray-800">
        {children}
      </div>
    </div>
  );
};

// Modal Header Component
export const ModalHeader = ({ children }) => {
  return (
    <div className="border-b p-2">
      <h3 className="text-lg font-semibold">{children}</h3>
    </div>
  );
};

// Modal Body Component
export const ModalBody = ({ children }) => {
  return (
    <div className="p-2">
      <p>{children}</p>
    </div>
  );
};

// Modal Footer Component
export const ModalFooter = ({ children }) => {
  return (
    <div className="flex justify-end gap-2 border-t p-2">
      {children}
    </div>
  );
};
