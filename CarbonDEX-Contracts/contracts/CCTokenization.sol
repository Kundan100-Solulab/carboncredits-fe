// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "contracts/CarbonCreditToken.sol";
contract CCTokenization is  Ownable {
    mapping(address => bool) private _authorizedIssuers;
    mapping(string => Certificate) private _certificates;
    CarbonCreditToken public ccToken;
    struct Certificate {
        bool isValid;
        bool isMinted;
        string serial;
        uint256 left;
        uint256 totalTokens;
    }
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event CreditsMinted(address indexed to, uint256 amount, string serialNo);
    event CreditsBurned(address indexed from, uint256 amount);
    event CertificateAdded(string serialNo, uint256 amount);
   event CertificateVerified(string serialNo);
    constructor(address ccTokenAddress)  Ownable(msg.sender) {
        _authorizedIssuers[owner()] = true;
        ccToken=CarbonCreditToken(ccTokenAddress);
    }

    modifier onlyAuthorizedIssuer() {
        require(_authorizedIssuers[msg.sender], "Caller is not an authorized issuer");
        _;
    }

    function authorizeIssuer(address issuer) public onlyOwner {
        _authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    function revokeIssuer(address issuer) public onlyOwner {
        _authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    function addCertificate(string memory serialNo, uint256 amount) public onlyAuthorizedIssuer {
        require(!_certificates[serialNo].isValid, "Certificate already exists");
        _certificates[serialNo] = Certificate(true, false, serialNo,amount,amount);
        
        emit CertificateAdded(serialNo, amount);
        
    }

    function mintCredits(address to, string memory serialNo) public  {
        Certificate storage cert = _certificates[serialNo];
        require(cert.isValid, "Invalid certificate");
        require(!cert.isMinted, "Certificate already minted");
        emit CertificateVerified(serialNo);
         uint256 leftTokens=cert.left;
         cert.left=0;
        cert.isMinted = true;
        ccToken.mint(to, leftTokens);
        emit CreditsMinted(to, leftTokens, serialNo);
    }


    function isAuthorizedIssuer(address account) public view returns (bool) {
        return _authorizedIssuers[account];
    }

    function getCertificateInfo(string memory serialNo) public view returns (bool isValid, uint256 amount, bool isMinted) {
        Certificate memory cert = _certificates[serialNo];
        return (cert.isValid, cert.left, cert.isMinted);
    }
    function getBalance(address account) public view returns (uint256){
        return ccToken.balanceOf(account);
    }

}