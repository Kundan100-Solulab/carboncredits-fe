"use client"

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, BarChartIcon, TrendingUpIcon, Wallet, ClockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '../../../Components/Alert';

const CarbonCreditsTradingPage = () => {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [portfolio, setPortfolio] = useState({ credits: 100, cash: 5000 });
  const [selectedTab, setSelectedTab] = useState('price');
  const [alertMessage, setAlertMessage] = useState('');
  const [transactionPreview, setTransactionPreview] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // ... (keep the useEffect and fetchData function as before)

  const handleTradePreview = (action, amount) => {
    const cost = amount * price;
    if (action === 'buy') {
      if (cost > portfolio.cash) {
        setAlertMessage("Insufficient funds for this purchase.");
        return;
      }
      setTransactionPreview({
        action: 'buy',
        amount,
        cost,
        newBalance: { 
          credits: portfolio.credits + amount,
          cash: portfolio.cash - cost
        }
      });
    } else {
      if (amount > portfolio.credits) {
        setAlertMessage("Insufficient credits for this sale.");
        return;
      }
      setTransactionPreview({
        action: 'sell',
        amount,
        cost,
        newBalance: {
          credits: portfolio.credits - amount,
          cash: portfolio.cash + cost
        }
      });
    }
  };

  const handleTradeConfirm = () => {
    if (transactionPreview) {
      setPortfolio(transactionPreview.newBalance);
      setTransactionHistory(prev => [
        {
          id: Date.now(),
          action: transactionPreview.action,
          amount: transactionPreview.amount,
          price: price,
          timestamp: new Date().toLocaleString()
        },
        ...prev
      ]);
      setAlertMessage(`Successfully ${transactionPreview.action === 'buy' ? 'bought' : 'sold'} ${transactionPreview.amount} credits.`);
      setTransactionPreview(null);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12 text-green-500 text-center">Carbon Credits Trading</h1>
        
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Alert className="mb-6 bg-gray-800 border-green-500">
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Keep the existing grid layout for price, portfolio, and market overview */}
        
        {/* Keep the existing chart component */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">Trade Credits</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleTradePreview(e.target.action.value, parseFloat(e.target.amount.value)); }}>
              <div className="mb-4">
                <label htmlFor="action" className="block text-sm font-medium text-gray-400 mb-2">Action</label>
                <select id="action" name="action" className="w-full rounded-lg bg-gray-700 border-gray-600 text-green-400 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 p-3">
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                <input type="number" id="amount" name="amount" className="w-full rounded-lg bg-gray-700 border-gray-600 text-green-400 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 p-3" placeholder="Enter amount" />
              </div>
              <motion.button 
                type="submit" 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preview Trade
              </motion.button>
            </form>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">Transaction Preview</h2>
            {transactionPreview ? (
              <div>
                <p className="mb-2">Action: {transactionPreview.action === 'buy' ? 'Buy' : 'Sell'}</p>
                <p className="mb-2">Amount: {transactionPreview.amount} credits</p>
                <p className="mb-2">Cost: ${transactionPreview.cost.toFixed(2)}</p>
                <p className="mb-4">New Balance: {transactionPreview.newBalance.credits} credits, ${transactionPreview.newBalance.cash.toFixed(2)} cash</p>
                <motion.button 
                  onClick={handleTradeConfirm}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm Trade
                </motion.button>
              </div>
            ) : (
              <p className="text-gray-400">No transaction previewed yet.</p>
            )}
          </motion.div>
        </div>

        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400 flex items-center">
            <ClockIcon className="mr-2" /> Transaction History
          </h2>
          {transactionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4">Action</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map(transaction => (
                    <tr key={transaction.id} className="border-b border-gray-700">
                      <td className="py-2 px-4">{transaction.action}</td>
                      <td className="py-2 px-4">{transaction.amount} credits</td>
                      <td className="py-2 px-4">${transaction.price.toFixed(2)}</td>
                      <td className="py-2 px-4">{transaction.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No transactions yet.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CarbonCreditsTradingPage;