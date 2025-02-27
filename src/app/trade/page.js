"use client"


import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, BarChartIcon, TrendingUpIcon, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '../../../Components/Alert';
import AccountOverview from '../../../Components/AccountOverview';

const CarbonCreditsTradingPage = () => {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [portfolio, setPortfolio] = useState({ credits: 100, cash: 5000 });
  const [selectedTab, setSelectedTab] = useState('price');
  const [alertMessage, setAlertMessage] = useState('');
  const [transactionPreview, setTransactionPreview] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30');
        const data = await response.json();
        
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString().split('T')[0],
          price: price,
          volume: data.total_volumes.find(([volumeTimestamp, _]) => volumeTimestamp === timestamp)?.[1] || 0
        }));

        setChartData(formattedData);
        const latestPrice = formattedData[formattedData.length - 1].price;
        const previousPrice = formattedData[formattedData.length - 2].price;
        setPrice(latestPrice);
        setChange(latestPrice - previousPrice);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlertMessage('Failed to fetch market data. Please try again later.');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const handleTrade = (action, amount) => {
    const cost = amount * price;
    if (action === 'buy') {
      if (cost > portfolio.cash) {
        setAlertMessage("Insufficient funds to complete this purchase.");
        return;
      }
      setPortfolio(prev => ({
        credits: prev.credits + amount,
        cash: prev.cash - cost
      }));
    } else {
      if (amount > portfolio.credits) {
        setAlertMessage("Insufficient credits to complete this sale.");
        return;
      }
      setPortfolio(prev => ({
        credits: prev.credits - amount,
        cash: prev.cash + cost
      }));
    }
    setAlertMessage(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${amount} credits.`);
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
        
        {alertMessage && (
          <Alert className="mb-6 bg-gray-800 border-green-500">
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

         <AccountOverview 
          portfolio={portfolio} 
          totalTrades={transactionHistory.length} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400 flex items-center">
              <DollarSignIcon className="mr-2" /> Current Price
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-bold">${price.toFixed(2)}</span>
              <motion.span 
                className={`flex items-center text-lg ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                {change >= 0 ? <ArrowUpIcon size={24} className="mr-1" /> : <ArrowDownIcon size={24} className="mr-1" />}
                {Math.abs(change).toFixed(2)}
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400 flex items-center">
              <Wallet className="mr-2" /> Your Portfolio
            </h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400 mb-1">Credits</p>
                <p className="text-2xl sm:text-3xl font-bold">{portfolio.credits}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cash</p>
                <p className="text-2xl sm:text-3xl font-bold">${portfolio.cash.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400 flex items-center">
              <TrendingUpIcon className="mr-2" /> Market Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">24h Volume</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {chartData.length > 0 ? chartData[chartData.length - 1].volume.toFixed(2) : 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                <p className="text-xl sm:text-2xl font-bold">
                  ${chartData.length > 0 ? (chartData[chartData.length - 1].price * 1000000).toFixed(2) : 'Loading...'}M
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex mb-6">
            <motion.button
              className={`mr-4 px-4 py-2 rounded-lg ${selectedTab === 'price' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedTab('price')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Price
            </motion.button>
            <motion.button
              className={`mr-4 px-4 py-2 rounded-lg ${selectedTab === 'volume' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedTab('volume')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volume
            </motion.button>
          </div>
          <div className="h-64 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              {selectedTab === 'price' ? (
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#4ade80" />
                  <YAxis stroke="#4ade80" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Line type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="#4ade80" />
                  <YAxis stroke="#4ade80" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Bar dataKey="volume" fill="#4ade80" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">Buy Credits</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleTrade('buy', parseFloat(e.target.buyAmount.value)); }}>
              <div className="mb-4">
                <label htmlFor="buyAmount" className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                <input type="number" id="buyAmount" className="w-full rounded-lg bg-gray-700 border-gray-600 text-green-400 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 p-3" placeholder="Enter amount" />
              </div>
              <motion.button 
                type="submit" 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy
              </motion.button>
            </form>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">Sell Credits</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleTrade('sell', parseFloat(e.target.sellAmount.value)); }}>
              <div className="mb-4">
                <label htmlFor="sellAmount" className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                <input type="number" id="sellAmount" className="w-full rounded-lg bg-gray-700 border-gray-600 text-green-400 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 p-3" placeholder="Enter amount" />
              </div>
              <motion.button 
                type="submit" 
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sell
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarbonCreditsTradingPage;

