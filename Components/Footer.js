import React from "react";
import Button from "./Button";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2025 CarbonCredits. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link
            href="/"
            className="hover:text-green-400 transition-colors duration-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="hover:text-green-400 transition-colors duration-300"
          >
            Terms of Service
          </Link>
          <Link
            href="/"
            className="hover:text-green-400 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
