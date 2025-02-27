"use client";

import React from "react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import SellPage from "../../../Components/SellPage";

const Sell = () => {
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
      <SellPage />
    </ThirdwebProvider>
  );
};

export default Sell;
