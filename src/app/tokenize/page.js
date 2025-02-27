"use client";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import React from "react";
import Tokenize from "../../../Components/Tokenize";

export default function TokenizePage() {
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
      <Tokenize />
    </ThirdwebProvider>
  );
}
