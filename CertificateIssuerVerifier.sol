// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateIssuerVerifier {
    struct Certificate {
        uint256 id;
        address issuer;
        string certificateData;  // Encrypted certificate data
        string imageReference;   // Reference to the certificate image (e.g., IPFS hash)
        bool verified;
        bool revoked;
    }

    struct User {
        string fullName;
        string contact;
        string email;
        address issuerAddress; // Store the issuer's address
    }

    struct Verification {
        string verificationStatus;
    }

    mapping(address => User) public users;
    mapping(address => Certificate) public certificates;

    address public admin;
    uint256 public numberOfCertificates;
    Verification public verificationContract; // Instance of the Verification struct

    event CertificateAdded(uint256 certificateId, address indexed issuer);
    event CertificateVerified(uint256 certificateId, address indexed verifier);
    event CertificateRevoked(uint256 certificateId, address indexed revoker);
    event UserRegistered(address indexed userAddress, string fullName, string contact, string email);
    event CertificateDownloaded(uint256 certificateId, address indexed user);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
        numberOfCertificates = 0;
        verificationContract.verificationStatus = "Contract deployed successfully!";
    }

    function addCertificate(string memory encryptedData, string memory imageReference) public {
        require(certificates[msg.sender].issuer == address(0), "Organization has already issued a certificate.");
        numberOfCertificates++;
        certificates[msg.sender] = Certificate(numberOfCertificates, msg.sender, encryptedData, imageReference, false, false);
        emit CertificateAdded(numberOfCertificates, msg.sender);
    }

    function verifyCertificate() public {
        Certificate storage certificate = certificates[users[msg.sender].issuerAddress]; // Use the issuer's address
        require(!certificate.verified, "Certificate is already verified.");
        certificate.verified = true;
        emit CertificateVerified(certificate.id, msg.sender);
    }

    function revokeCertificate() public onlyAdmin {
        Certificate storage certificate = certificates[users[msg.sender].issuerAddress]; // Use the issuer's address
        require(!certificate.revoked, "Certificate is already revoked.");
        certificate.revoked = true;
        emit CertificateRevoked(certificate.id, msg.sender);
    }

    function registerUser(string memory fullName, string memory contact, string memory email) public {
        require(users[msg.sender].issuerAddress == address(0), "User is already registered.");
        users[msg.sender] = User(fullName, contact, email, address(0));
        emit UserRegistered(msg.sender, fullName, contact, email);
    }

    function downloadCertificate() public {
        User storage user = users[msg.sender];
        require(user.issuerAddress != address(0), "User has no certificate to download.");
        Certificate storage certificate = certificates[user.issuerAddress]; // Use the issuer's address
        require(certificate.verified, "Certificate is not verified");
        emit CertificateDownloaded(certificate.id, msg.sender);
    }
}
