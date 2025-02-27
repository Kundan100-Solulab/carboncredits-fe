"use client";

import React from "react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  trustWallet,
} from "@thirdweb-dev/react";

import BuyPage from "../../../Components/BuyPage";

const Buy = () => {
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
      <BuyPage />
    </ThirdwebProvider>
  );
};

export default Buy;
