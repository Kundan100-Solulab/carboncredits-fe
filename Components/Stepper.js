"use client";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import { Alert } from "./Alert";
import { useRouter } from "next/navigation";
import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { ethers } from "ethers";
const CCTokenization = require("../src/app/utils/CCTokenization.json");
const Stepper = ({ address, serialNo }) => {
  const { contract: tokenization, isLoading: isTokenLoading } = useContract(
    process.env.NEXT_PUBLIC_TOKENIZE_ADDRESS,
    CCTokenization
  );
  const [events, setEvents] = useState([]);
  const [tokensMinted, settokensMinted] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, seterrorMsg] = useState("");
  const totalSteps = 3;
  const signer = useSigner();
  const address1 = useAddress();
  const router = useRouter();

  const Tokenize = async () => {
    if (tokenization) {
      console.log("address", address1);
      console.log("Tokenizing...");
      try {
        seterrorMsg("");
        settokensMinted(0);
        const getCertificate = await tokenization.call("getCertificateInfo", [
          serialNo,
        ]);
        if (getCertificate[0] && !getCertificate[2]) {
          setCurrentStep(2);
          const tokens = ethers.utils.formatUnits(
            getCertificate[1].toString(),
            18
          );
          const tokenizing = await tokenization.call("mintCredits", [
            address,
            serialNo,
          ]);
          //  const tx=await tokenizing.wait()
          //  console.log("Transaction",tx)
          setCurrentStep(3);
          settokensMinted(tokens);
        } else {
          seterrorMsg("Certificate already tokenized");
        }
      } catch (error) {
        settokensMinted(0);
        // seterrorMsg("Error in tokenization")
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (address1) {
      Tokenize();
    }
  }, [address1, signer]);

  return (
    <div className="max-w-2xl mx-auto p-12">
      <div className="relative">
        {[
          { step: 1, topic: "Verifying" },
          { step: 2, topic: "Validating" },
          { step: 3, topic: "Tokenizing" },
        ].map(({ step, topic }) => (
          <div key={step} className="flex items-center mb-16">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-1000 ease-in-out ${
                  step < currentStep
                    ? "bg-green text-black scale-90"
                    : step === currentStep
                    ? "bg-green text-black scale-110 shadow-xl"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`absolute left-8 top-16 w-1 h-24 transition-all duration-1000 ease-in-out ${
                    step < currentStep ? "bg-green" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <div
              className={`ml-8 transition-all duration-1000 ease-in-out ${
                step === currentStep ? "transform translate-x-4" : ""
              }`}
            >
              <div
                className={`text-2xl font-bold mb-2 ${
                  step === currentStep ? "text-white" : "text-gray-700"
                }`}
              >
                {topic}
              </div>
            </div>
          </div>
        ))}
      </div>
      {tokensMinted && !errorMsg && (
        <Alert className="text-white">
          {tokensMinted} Tokens minted successfully{" "}
        </Alert>
      )}
      {errorMsg && !tokensMinted && (
        <Alert className="text-white border-red-600">{errorMsg}</Alert>
      )}
    </div>
  );
};

export default Stepper;
