// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonCreditToken.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract CarbonCreditExchange {
    CarbonCreditToken public token;
    AggregatorV3Interface internal priceFeed;

    event TokensPurchased(address buyer, uint256 amount);
    event TokensSold(address seller, uint256 amount);
    event ListingAdded(address seller, uint256 amount);

    constructor(CarbonCreditToken _token) {
        token = _token;
        priceFeed = AggregatorV3Interface(
            0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
        );
    }

    function getLatestETHUSDPrice() public view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price) / 10 ** 8;
    }

    function addListing(uint256 tokenAmount) public {
        uint256 tokenAmountInWei = tokenAmount * 10 ** 18;
        require(
            token.balanceOf(msg.sender) >= tokenAmountInWei,
            "Not enough tokens to list"
        );
        token.approve(address(this), tokenAmountInWei);
        emit ListingAdded(msg.sender, tokenAmountInWei);
    }

    function buyListedTokens(
        uint256 _amount,
        uint256 _sellerUSDTokenPrice,
        address seller
    ) public payable {
        uint256 totalUSDPrice = _amount * _sellerUSDTokenPrice;
        uint256 ethPrice = getLatestETHUSDPrice();
        uint256 priceInWei = (totalUSDPrice * 10 ** 18) / ethPrice;
        uint256 tokenAmount = _amount * 10 ** 18;

        uint256 tokenBalance = token.balanceOf(seller);
        require(tokenBalance >= tokenAmount, "Not enough tokens available");
        require(msg.value >= priceInWei, "Insufficient Ether sent");
        require(
            token.allowance(seller, address(this)) >= tokenAmount,
            "Seller has not approved enough tokens"
        );

        token.transferFrom(seller, msg.sender, tokenAmount);
        payable(seller).transfer(priceInWei);
        emit TokensPurchased(msg.sender, tokenAmount);

        if (msg.value > priceInWei) {
            payable(msg.sender).transfer(msg.value - priceInWei);
        }
    }

    function buyTokens(uint256 _amount, uint256 _USDTokenPrice) public payable {
        uint256 totalUSDPrice = _amount * _USDTokenPrice;
        uint256 ethPrice = getLatestETHUSDPrice();
        require(ethPrice > 0, "Invalid ETH price from oracle");

        uint256 priceInWei = (totalUSDPrice * 10 ** 18) / ethPrice;
        uint256 tokenAmount = _amount * 10 ** 18;

        require(msg.value >= priceInWei, "Insufficient Ether sent");

        token.mint(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, tokenAmount);

        if (msg.value > priceInWei) {
            payable(msg.sender).transfer(msg.value - priceInWei);
        }
    }

    function withdrawEther() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
