"use client";

import {
  ConnectWallet,
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import {
  ArrowRight,
  BarChart2,
  Globe,
  RefreshCw,
  Shield,
  Wallet,
  Menu,
  X,
  TrendingUp,
  Leaf,
  DollarSign,
  Bitcoin,
  Layers,
} from "lucide-react";
import WavyDotPattern from "./WavyDotPattern";
import Footer from "./Footer";
import Image from "next/image";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Buy", path: "/buy" },
    { name: "Sell", path: "/sell" },
    { name: "Tokenize", path: "/tokenize" },
  ];

  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={"base-sepolia-testnet"}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        trustWallet(),
      ]}
    >
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <header
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrollPosition > 50
              ? "bg-gray-900/90 backdrop-blur-md py-2"
              : "bg-transparent py-4"
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-green-400">
              CarbonCredits
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <ConnectWallet
                style={{ backgroundColor: "rgb(22 163 74)", borderWidth: 0 }}
                theme="light"
                modalSize="wide"
                welcomeScreen={{
                  title: "Connect your wallet",
                  subtitle: "Choose from multiple wallet providers",
                }}
                modalTitle="Connect Wallet"
              />
            </nav>
            <button
              className="md:hidden text-gray-300 hover:text-green-400 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-40 bg-gray-900 transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-2xl text-gray-300 hover:text-green-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <ConnectWallet
              style={{ backgroundColor: "rgb(22 163 74)", borderWidth: 0 }}
              theme="light"
              modalSize="wide"
              welcomeScreen={{
                title: "Connect your wallet",
                subtitle: "Choose from multiple wallet providers",
              }}
              modalTitle="Connect Wallet"
            />
          </div>
        </div>

        <main className="pt-20">
          <section className="h-screen flex items-center justify-center text-center px-4 relative  overflow-hidden">
            <WavyDotPattern className={`w-full`} />
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                Revolutionizing Carbon Credit Trading in India and Beyond
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-10">
                Seamless. Transparent. Impactful.
              </p>
              <button
                style={{
                  backgroundColor: "rgb(22 163 74)",
                  borderWidth: 0,
                  fontSize: "1.25rem",
                  borderRadius: "9999px",
                  padding: "0.75rem 2rem",
                  fontWeight: "bold",
                }}
              >
                Join the Green Revolution
              </button>
            </div>
          </section>

          <section id="features" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center mb-16 text-white">
                Why Choose CarbonCredits?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-16 h-16 text-green-400 mb-6" />,
                    title: "Unmatched Transparency",
                    description:
                      "Blockchain technology ensures trust and traceability in every transaction.",
                  },
                  {
                    icon: (
                      <FaEthereum className="w-16 h-16 text-green-400 mb-6" />
                    ),
                    title: "Trading On Base",
                    description:
                      "Leveraging Base's Ethereum compatibility, low costs, and high throughput for efficient, scalable carbon credit trading.",
                  },
                  {
                    icon: <Globe className="w-16 h-16 text-green-400 mb-6" />,
                    title: "Pioneer in India",
                    description:
                      "India's first decentralized carbon credit marketplace, tapping into a $1.2 billion market.",
                  },
                  {
                    icon: (
                      <BarChart2 className="w-16 h-16 text-green-400 mb-6" />
                    ),
                    title: "Explosive Growth",
                    description:
                      "Join a sector expanding at 24.4% annually, with massive potential for early adopters.",
                  },
                  {
                    icon: <Leaf className="w-16 h-16 text-green-400 mb-6" />,
                    title: "Eco-Friendly Profits",
                    description:
                      "Earn returns while contributing to environmental sustainability.",
                  },
                  {
                    icon: (
                      <DollarSign className="w-16 h-16 text-green-400 mb-6" />
                    ),
                    title: "Global Opportunity",
                    description:
                      "Tap into the $103.8 billion global carbon credit market.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-gray-700 rounded-lg shadow-lg border border-gray-600 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
                  >
                    {feature.icon}
                    <h4 className="text-2xl font-semibold mb-4 text-white">
                      {feature.title}
                    </h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center mb-16 text-white">
                How It Works
              </h3>
              <div className="flex flex-col sm:flex-row sm:gap-32">
                <div className="max-w-3xl mx-auto w-full">
                  {[
                    "Register and verify your account",
                    "List your carbon credits or browse available offerings",
                    "Use our advanced matching algorithm to find the best deals",
                    "Complete secure transactions with blockchain technology",
                    "Track your impact and receive detailed reports",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center mb-12 group">
                      <div className="bg-green-500 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center mr-6 text-xl font-bold transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-xl text-gray-300 group-hover:text-green-400 transition-colors duration-300">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block sm:w-96 sm:h-96">
                  <Layers className="w-full h-full text-green-500 mr-20" />
                </div>
              </div>
            </div>
          </section>

          <section id="market-potential" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-4xl font-bold mb-12 text-white">
                Massive Market Potential
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                  <h4 className="text-2xl font-semibold mb-4 text-green-400">
                    India Market
                  </h4>
                  <p className="text-3xl font-bold text-white">$1.2 Billion</p>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                  <h4 className="text-2xl font-semibold mb-4 text-green-400">
                    Global Market
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    $103.8 Billion
                  </p>
                </div>
              </div>
              <p className="mt-12 text-xl text-gray-300">
                Join us in capturing this rapidly growing market, expanding at
                an unprecedented rate of 24.4% annually.
              </p>
            </div>
          </section>

          <section id="contact" className="py-20 bg-gray-900 text-center">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold mb-8 text-white">
                Ready to Make a Difference?
              </h3>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join CarbonDex today. Profit from sustainability and help create
                a greener future.
              </p>
              <Link href="/marketplace">
                <button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Get Started Now <ArrowRight className="ml-2" />
                </button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThirdwebProvider>
  );
};

export default LandingPage;
