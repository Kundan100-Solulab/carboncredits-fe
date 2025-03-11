export const handleDeposit = async (amount) => {
  try {
    setButtonText("Processing Deposit...");

    const tokenContract = new ethers.Contract(
      tokenAddress,
      CarbonCreditTokenABI,
      signer
    );

    const tokenAmount = Math.floor(amount);
    const amountInWei = ethers.utils.parseEther(tokenAmount.toString());

    // Approve tokens
    const approveTx = await tokenContract.approve(exchangeAddress, amountInWei);
    await approveTx.wait();

    // Deposit tokens
    const tx = await exchange.call("depositTokens", [tokenAmount], {
      gasLimit: 300000,
    });

    await tx.wait();

    // Get updated exchange balance
    const exchangeBalance = await exchange.getUserBalance(address);
    setMyBalance(ethers.utils.formatUnits(exchangeBalance, 18));

    setShowSuccessAlert(true);
    setButtonText("Deposit");

    await addDoc(collection(db, "deposits"), {
      address,
      amount: tokenAmount,
      exchangeBalance: ethers.utils.formatUnits(exchangeBalance, 18),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    setButtonText("Deposit");
    console.error("Deposit failed:", error);
    alert("Failed to deposit tokens: " + error.message);
  }
};

//Withdraw handler

export const handleWithdraw = async (amount) => {
  try {
    setButtonText("Processing Withdrawal...");

    const withdrawAmount = Math.floor(amount);

    // Get current exchange balance before withdrawal
    const currentBalance = await exchange.getUserBalance(address);

    const tx = await exchange.call("withdrawTokens", [withdrawAmount], {
      gasLimit: 300000,
    });

    await tx.wait();

    // Get updated exchange balance
    const newBalance = await exchange.getUserBalance(address);
    setMyBalance(ethers.utils.formatUnits(newBalance, 18));

    setShowSuccessAlert(true);
    setButtonText("Withdraw");

    await addDoc(collection(db, "withdrawals"), {
      address,
      amount: withdrawAmount,
      exchangeBalance: ethers.utils.formatUnits(newBalance, 18),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    setButtonText("Withdraw");
    console.error("Withdrawal failed:", error);
    alert("Failed to withdraw tokens: " + error.message);
  }
};
