"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ConnectWallet } from "@thirdweb-dev/react";

const NavItem = ({ href, children, isActive }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

const Navbar = ({
  logo,
  onConnectWallet,
  connectWalletText = "Connect Wallet",
  bgColor = "bg-gray-800",
  textColor = "text-white",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Buy", href: "/buy" },
    { name: "Sell", href: "/sell" },
    { name: "Tokenize", href: "/tokenize" },
  ];

  return (
    <nav className={`${bgColor} ${textColor} mb-16 w-full rounded-xl py-2.5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-green-400">
              CarbonCredits
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    href={item.href}
                    isActive={pathname === item.href}
                  >
                    {item.name}
                  </NavItem>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
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
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.name}
              </NavItem>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <button
              onClick={onConnectWallet}
              className="block px-4 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-full"
            >
              {connectWalletText}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
