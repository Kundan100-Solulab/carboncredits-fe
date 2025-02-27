"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  User,
  CreditCard,
  Briefcase,
  Settings,
  HelpCircle,
  CopyIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "./Navbar2";
import { motion } from "framer-motion";
import { useAddress, useContract, useSigner } from "@thirdweb-dev/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";
import { format } from "date-fns";
import { ethers } from "ethers";
import Footer from "./Footer";

const tokenAddress = "0x2181dCA9782E00C217D9a0e9570919A39EF530d8";
const exchangeAddress = "0x2f5e216a8096e6e65228Fab61a1e3D246f718c0E";
const priceFeedAddress = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
const CarbonCreditTokenABI = require("../src/app/utils/CarbonCreditToken.json");
const CarbonCreditExchangeABI = require("../src/app/utils/CarbonCreditExchange.json");
const AggregatorV3InterfaceABI = require("../src/app/utils/AggregatorV3Interface.json");

const MarketplacePage = () => {
  const [selectedToken, setSelectedToken] = useState("CCT");
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("price");

  const address = useAddress();
  const signer = useSigner();

  const { contract: token, isLoading: isTokenLoading } = useContract(
    tokenAddress,
    CarbonCreditTokenABI
  );
  const { contract: exchange, isLoading: isExchangeLoading } = useContract(
    exchangeAddress,
    CarbonCreditExchangeABI
  );
  const { contract: priceFeed, isLoading: isPriceFeedLoading } = useContract(
    priceFeedAddress,
    AggregatorV3InterfaceABI
  );

  useEffect(() => {
    fetchChartData();
    const priceUpdateInterval = setInterval(fetchLatestPrice, 60000); // Update price every minute

    return () => clearInterval(priceUpdateInterval);
  }, [selectedToken]);

  useEffect(() => {
    setTotalCost(Number(buyAmount) * currentPrice);
  }, [buyAmount, currentPrice]);

  useEffect(() => {
    const listingsQuery = query(
      collection(db, "listings"),
      orderBy("createdAt", "desc")
    );
    const transactionsQuery = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeListings = onSnapshot(listingsQuery, (querySnapshot) => {
      const listingsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setListings(listingsArray);
      setTotalListings(listingsArray.length);
    });

    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (querySnapshot) => {
        const transactionsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactionsArray);
      }
    );

    return () => {
      unsubscribeListings();
      unsubscribeTransactions();
    };
  }, []);

  useEffect(() => {
    getMyBalance();
  }, [address, token]);

  const getMyBalance = async () => {
    if (address && token) {
      try {
        const balance = await token.call("balanceOf", [address]);
        setMyBalance(ethers.utils.formatUnits(balance.toString(), 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const fetchLatestPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=moss-carbon-credit&vs_currencies=usd"
      );
      const data = await response.json();
      const latestPrice = data["moss-carbon-credit"].usd;
      setCurrentPrice(latestPrice * 100);
    } catch (error) {
      console.error("Error fetching latest price:", error);
      setError("Failed to fetch the latest price. Please try again later.");
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30"
      );
      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, price]) => ({
        date: format(new Date(timestamp), "dd-MMM-yy"),
        price: price * 100,
        volume:
          data.total_volumes.find(
            ([volumeTimestamp, _]) => volumeTimestamp === timestamp
          )?.[1] || 0,
      }));
      setChartData(formattedData);
      // Set the current price to the latest price in the chart data
      setCurrentPrice(formattedData[formattedData.length - 1].price);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setError("Failed to fetch chart data. Please try again later.");
    }
  };

  async function getLatestEthUsdPrice() {
    const priceFeed = new ethers.Contract(
      priceFeedAddress,
      AggregatorV3InterfaceABI,
      signer
    );
    const latestRoundData = await priceFeed.latestRoundData();
    const price = ethers.utils.formatUnits(latestRoundData.answer, 8);
    return Math.round(price);
  }

  const handleBuyListedTokens = async (
    id,
    amount,
    sellerUSDTokenPrice,
    seller
  ) => {
    try {
      if (!address || !signer || !token || !exchange) {
        throw new Error(
          "Signer, provider, or contract instance is not properly initialized."
        );
      }

      const totalUSDPrice = ethers.utils.parseUnits(
        (amount * sellerUSDTokenPrice).toString(),
        18
      );
      const ethPrice = await getLatestEthUsdPrice();
      const priceInWei = totalUSDPrice.div(ethPrice);
      const newPriceInWei = priceInWei.add(
        ethers.utils.parseUnits("0.0001", 18)
      );

      const accountBalance = await signer.provider.getBalance(address);
      if (accountBalance.lt(newPriceInWei)) {
        alert("Insufficient funds for the transaction");
        return;
      }

      try {
        const tx = await exchange.call(
          "buyListedTokens",
          [amount, sellerUSDTokenPrice, seller],
          {
            value: newPriceInWei,
          }
        );
        alert("Tokens purchased successfully!");

        const transactionData = {
          buyer: address,
          seller: seller,
          amount: amount,
          price: sellerUSDTokenPrice,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "transactions"), transactionData);
        await deleteDoc(doc(db, "listings", id));
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        alert("Gas estimation failed. See console for details.");
      }
    } catch (error) {
      console.error("Error buying tokens!", error);
      alert("Error buying tokens. Please try again later...", error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage("Address copied to clipboard!");
    setTimeout(() => {
      setCopiedMessage("");
    }, 2000); // Hide the message after 2 seconds
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Navbar />
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-green-400">
              Carbon Credit Marketplace
            </h1>
          </header>

          <motion.div
            className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-green-400 flex items-center">
              <User className="mr-2" /> Account Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">
                  Balance
                </h3>
                <p className="text-2xl font-bold text-green-500">
                  {myBalance} CCT
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Value: ${(myBalance * currentPrice).toFixed(2)}</p>
                  <p>Price: ${currentPrice.toFixed(2)} (per CCT)</p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <h3 className="text-lg font-medium mb-2 text-gray-300">
                  Account Stats
                </h3>
                <p className="text-sm text-gray-400">Account Type: Standard</p>
                <p className="text-sm text-gray-400">
                  Member Since:{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date())}
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
              >
                <Briefcase className="mb-2" />
                <span className="text-sm">Withdraw</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

          <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Token Selection, Details, and Buy Functionality */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Details</h2>
              <div className="mt-12">
                <div className="space-y-6 mt-10">
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-green-400">
                      {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}{" "}
                      <CopyIcon
                        className="inline-block ml-2 cursor-pointer"
                        size={16}
                        onClick={() => handleCopy(tokenAddress)}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>Moss Carbon Credit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span>{selectedToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price USD:</span>
                    <span>${currentPrice.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="col-span-1 sm:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg w-full">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex mb-6">
                    <motion.button
                      className={`mr-4 px-4 py-2 rounded-lg ${
                        selectedTab === "price"
                          ? "bg-green-600 text-white"
                          : "text-gray-400"
                      }`}
                      onClick={() => setSelectedTab("price")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Price
                    </motion.button>
                    <motion.button
                      className={`mr-4 px-4 py-2 rounded-lg ${
                        selectedTab === "volume"
                          ? "bg-green-600 text-white"
                          : "text-gray-400"
                      }`}
                      onClick={() => setSelectedTab("volume")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Volume
                    </motion.button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {selectedTab === "price" ? (
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" stroke="#4ade80" />
                          <YAxis stroke="#4ade80" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "none",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={chartData}>
                          <XAxis dataKey="date" stroke="#4ade80" />
                          <YAxis stroke="#4ade80" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "none",
                            }}
                          />
                          <Bar dataKey="volume" fill="#4ade80" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="col-span-1 sm:col-span-3"
            >
              <div>
                <div className="flex mb-9">
                  <button
                    className={`px-4 py-2 w-1/2 focus:outline-none ${
                      activeTab === "marketplace"
                        ? "border-b-2 border-green-600"
                        : ""
                    }`}
                    onClick={() => setActiveTab("marketplace")}
                  >
                    Marketplace
                  </button>
                  <button
                    className={`px-4 py-2 w-1/2 focus:outline-none ${
                      activeTab === "transactions"
                        ? "border-b-2 border-green-600"
                        : ""
                    }`}
                    onClick={() => setActiveTab("transactions")}
                  >
                    Transactions
                  </button>
                </div>
                <div className="mt-4">
                  {activeTab === "marketplace" && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-400">
                        Marketplace
                      </h2>
                      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Seller
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Price (USD)
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            {listings.map((listing) => (
                              <tr key={listing.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                  {format(
                                    new Date(listing.createdAt.toDate()),
                                    "dd-MMM-yyyy"
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {listing.address.slice(0, 6)}...
                                  {listing.address.slice(-5)}
                                  <CopyIcon
                                    className="inline-block ml-2 cursor-pointer"
                                    size={16}
                                    onClick={() => handleCopy(listing.address)}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {listing.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  ${listing.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {listing.address !== address && (
                                    <button
                                      onClick={() => {
                                        if (address) {
                                          handleBuyListedTokens(
                                            listing.id,
                                            listing.amount,
                                            listing.price,
                                            listing.address
                                          );
                                        } else {
                                          alert(
                                            "Please connect your wallet to buy tokens"
                                          );
                                        }
                                      }}
                                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                    >
                                      Buy
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {listings.length === 0 && (
                          <div className="p-4 text-center text-green-400">
                            No listings available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activeTab === "transactions" && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-400">
                        Transactions
                      </h2>
                      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Buyer
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Seller
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Tokens
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            {transactions.map((transaction) => (
                              <tr key={transaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                  {format(
                                    new Date(transaction.createdAt.toDate()),
                                    "dd-MMM-yyyy"
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {transaction.buyer.slice(0, 6)}...
                                  {transaction.buyer.slice(-5)}
                                  <CopyIcon
                                    className="inline-block ml-2 cursor-pointer"
                                    size={16}
                                    onClick={() =>
                                      handleCopy(transaction.buyer)
                                    }
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {transaction.seller.slice(0, 6)}...
                                  {transaction.seller.slice(-5)}
                                  <CopyIcon
                                    className="inline-block ml-2 cursor-pointer"
                                    size={16}
                                    onClick={() =>
                                      handleCopy(transaction.seller)
                                    }
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {transaction.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  ${transaction.price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {transactions.length === 0 && (
                          <div className="p-4 text-center text-green-400">
                            No transactions available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            {copiedMessage && (
              <div className="fixed bottom-4 right-4 bg-green-700 text-white p-4 rounded-lg shadow-lg">
                {copiedMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
