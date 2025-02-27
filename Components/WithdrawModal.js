import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import {
  useContract,
  useContractWrite,
  useAddress,
  useBalance,
} from "@thirdweb-dev/react";

export default function WithdrawModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const address = useAddress();

  const { contract } = useContract("YOUR_CONTRACT_ADDRESS");
  const { mutateAsync: withdraw } = useContractWrite(
    contract,
    "withdrawTokens"
  );

  const handleWithdraw = async () => {
    try {
      await withdraw({ args: [] });
      onClose();
    } catch (err) {
      console.error("Failed to withdraw:", err);
    }
  };

  return (
    isOpen && (
      <Modal onClose={onClose}>
        <ModalHeader>Withdraw Funds</ModalHeader>
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
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                placeholder="Enter amount to withdraw"
              />
            </div>
            <div className="text-sm text-gray-400">
              Connected Wallet:{" "}
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not connected"}
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
            onClick={handleWithdraw}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
          >
            Confirm Withdrawal
          </button>
        </ModalFooter>
      </Modal>
    )
  );
}
