"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Briefcase,
  Settings,
  HelpCircle,
} from "lucide-react";
import WithdrawModal from "./WithdrawModal";

const AccountOverview = ({ portfolio, totalTrades }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const accountValue = portfolio.credits * portfolio.price + portfolio.cash;

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  return (
    <>
      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-green-400 flex items-center">
          <User className="mr-2" /> Account Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-300">Balance</h3>
            <p className="text-2xl font-bold text-green-500">
              ${accountValue.toFixed(2)}
            </p>
            <div className="mt-2 text-sm text-gray-400">
              <p>Cash: ${portfolio.cash.toFixed(2)}</p>
              <p>
                Credits: {portfolio.credits} ($
                {(portfolio.credits * portfolio.price).toFixed(2)})
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <h3 className="text-lg font-medium mb-2 text-gray-300">
              Account Stats
            </h3>
            <p className="text-sm text-gray-400">Total Trades: {totalTrades}</p>
            <p className="text-sm text-gray-400">Account Type: Standard</p>
            <p className="text-sm text-gray-400">
              Member Since: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.button
            className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreditCard className="mb-2" />
            <span className="text-sm">Deposit</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWithdrawClick}
          >
            <Briefcase className="mb-2" />
            <span className="text-sm">Withdraw</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWithdrawClick}
          >
            <Settings className="mb-2" />
            <span className="text-sm">Settings</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircle className="mb-2" />
            <span className="text-sm">Support</span>
          </motion.button>
        </div>
      </motion.div>

      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
};

export default AccountOverview;
