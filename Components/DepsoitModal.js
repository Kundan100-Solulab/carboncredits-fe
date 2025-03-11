import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";

export default function DepositModal({ isOpen, onClose, onDeposit }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (amount && !isNaN(amount) && amount > 0) {
      onDeposit(amount);
      setAmount("");
      onClose();
    }
  };

  return (
    isOpen && (
      <Modal onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center z-100">
          <div className="bg-gray-800 w-[400px] h-[200px] rounded-lg p-6 relative">
            <ModalHeader>Deposit CCT Tokens</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Amount (CCT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 pl-3  block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter amount to deposit"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
              >
                Confirm Deposit
              </button>
            </ModalFooter>
          </div>
        </div>
      </Modal>
    )
  );
}
