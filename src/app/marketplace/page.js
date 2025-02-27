"use client";

import React from "react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  trustWallet,
} from "@thirdweb-dev/react";

import MarketplacePage from "../../../Components/MarketplacePage";

const MarketPlace = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={"base-sepolia-testnet"}
      supportedWallets={[metamaskWallet(), coinbaseWallet(), trustWallet()]}
    >
      <MarketplacePage />
    </ThirdwebProvider>
  );
};

export default MarketPlace;
