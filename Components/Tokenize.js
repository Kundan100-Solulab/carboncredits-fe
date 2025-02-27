"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar2";
import { useAddress } from "@thirdweb-dev/react";
import Footer from "./Footer";

export default function Tokenize() {
  const [serialNo, setSerialNo] = useState("");
  const address1 = useAddress();
  const [address, setAddress] = useState(address1);
  const [image, setImage] = useState(null);
  const router = useRouter();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (address1) {
      setAddress(address1);
    }
  }, [address1]);
  const handleTokenize = () => {
    // Implement tokenization logic here
    //how to go to a new page
    const queryParams = new URLSearchParams({
      serialNo: serialNo,
      address: address,
    }).toString();

    // Navigate to the new page
    if (!address1) {
      alert("Please connect wallet");
    } else if (!serialNo || !address || !image) {
      alert("Please fill all fields");
    } else {
      router.push(`/tokenizeConfirm?${queryParams}`);
    }
    //  router.push('/tokenizeConfirm')
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-900  items-center justify-center p-4">
        <Navbar />
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Tokenize Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Certificate Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {!image && (
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      )}
                      {image && (
                        <img
                          src={
                            image
                              ? URL.createObjectURL(image)
                              : "/placeholder.png"
                          }
                          alt="Certificate"
                          className="w-100 h-24 object-cover rounded-lg"
                        />
                      )}
                      {!image && (
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial-no">Serial Number</Label>
                <Input
                  id="serial-no"
                  placeholder="Enter serial number"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address"> Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleTokenize}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tokenize
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
