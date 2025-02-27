"use client";

import React from "react";
import { ThirdwebProvider, coinbaseWallet } from "@thirdweb-dev/react";
import HomePage from "../../Components/HomePage";

const LandingPage = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      // activeChain={"base-sepolia-testnet"}
      activeChain={"base-sepolia-testnet"}
      // supportedWallets={[coinbaseWallet()]}
      supportedWallets={[coinbaseWallet()]}
    >
      <HomePage />
    </ThirdwebProvider>
  );
};

export default LandingPage;
