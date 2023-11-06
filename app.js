// Import necessary libraries
const Web3 = require('web3');
const crypto = require('crypto-js');
const contractAddress = '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "encryptedData",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageReference",
				"type": "string"
			}
		],
		"name": "addCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "CertificateAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "CertificateDownloaded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "revoker",
				"type": "address"
			}
		],
		"name": "CertificateRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "verifier",
				"type": "address"
			}
		],
		"name": "CertificateVerified",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "downloadCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contact",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revokeCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "contact",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "verifyCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "certificateData",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageReference",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "verified",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "revoked",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "numberOfCertificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contact",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "issuerAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const Web3 = require('web3');

const alchemyUrl = 'https://eth-goerli.g.alchemy.com/v2/628L59-41bMIkZjg19DZDm6p-4z7D19Z/628L59-41bMIkZjg19DZDm6p-4z7D19Z';
const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to handle certificate verification
async function verifyCertificate() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const certificateData = document.getElementById('certificateData').value;

    // Generate a cryptographic hash of the certificate data
    const certificateHash = crypto.SHA256(certificateData).toString(crypto.enc.Hex);

    try {
        const isCertificateValid = await contract.methods.verifyCertificate(fullName, email, certificateHash).call();

        if (isCertificateValid) {
            // Certificate is verified and valid
            alert('Certificate is verified and valid.');

            // Display the cryptographic hash to the verifier
            alert('Cryptographic Hash Address: ' + certificateHash);
        } else {
            alert('Certificate verification failed.');
        }
    } catch (error) {
        console.error(error);
        alert('Error verifying certificate.');
    }
}
document.getElementById('verifyButton').addEventListener('click', function () {
    verifyCertificate();
});

// Function to handle certificate issuance (issuer functionality)
async function issueCertificate() {
    const fullNameIssuer = document.getElementById('fullNameIssuer').value;
    const emailIssuer = document.getElementById('emailIssuer').value;
    const certificateDataIssuer = document.getElementById('certificateDataIssuer').value;

    // Implement file upload if required

    try {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const gasLimit = 300000; // Set an appropriate gas limit
        const transaction = await contract.methods.issueCertificate(fullNameIssuer, emailIssuer, certificateDataIssuer).send({ from: userAddress, gas: gasLimit });

        if (transaction.status) {
            // Certificate issued successfully
            alert('Certificate issued successfully.');
        } else {
            alert('Certificate issuance failed.');
        }
    } catch (error) {
        console.error(error);
        alert('Error issuing certificate.');
    }
}
document.getElementById('issueCertificateButton').addEventListener('click', function () {
    issueCertificate();
});
