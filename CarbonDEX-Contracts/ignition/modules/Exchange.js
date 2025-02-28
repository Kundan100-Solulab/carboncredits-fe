const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("ethers");

module.exports = buildModule("ExchangeModule", (m) => {
  const exchangeContract = m.contract("CarbonCreditExchange", [
    "0x2181dCA9782E00C217D9a0e9570919A39EF530d8",
  ]);

  return { exchangeContract };
});
