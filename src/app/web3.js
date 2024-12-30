import { ethers } from 'ethers';
import { bytecode } from './bytecode';
const CONTRACT_ADDRESS = "0x5AE275eC4513809a25fDB8545C0199b6E20601af";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_winner",
				"type": "address"
			}
		],
		"name": "declareWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initializeBoard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "fromRow",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "fromCol",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "toRow",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "toCol",
				"type": "uint8"
			}
		],
		"name": "movePiece",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_whitePlayer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_blackPlayer",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "blackPlayer",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "board",
		"outputs": [
			{
				"internalType": "int104",
				"name": "",
				"type": "int104"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "row",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "col",
				"type": "uint8"
			}
		],
		"name": "getPiece",
		"outputs": [
			{
				"internalType": "int104",
				"name": "",
				"type": "int104"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "whitePlayer",
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
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export async function getContract(withSigner = false) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const signer = withSigner ? provider.getSigner() : null;
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      withSigner ? signer : provider
    );

    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    throw error;
  }
}

export async function deployChessContract(whitePlayerAddress, blackPlayerAddress) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  if (!whitePlayerAddress || !ethers.utils.isAddress(whitePlayerAddress)) {
    throw new Error("Invalid white player address");
  }

  if (!blackPlayerAddress || !ethers.utils.isAddress(blackPlayerAddress)) {
    throw new Error("Invalid black player address");
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const nonce = await provider.getTransactionCount(await signer.getAddress());
    const gasPrice = await provider.getGasPrice();

    const factory = new ethers.ContractFactory(
      CONTRACT_ABI,
      bytecode,
      signer
    );

    const deploymentOptions = {
      gasLimit: 2000000,
      gasPrice: gasPrice.mul(110).div(100),
      nonce: nonce
    };

    const contract = await factory.deploy(
      whitePlayerAddress, 
      blackPlayerAddress,
      deploymentOptions
    );
    
    // Wait for more confirmations
    await contract.deployTransaction.wait(2);
    return contract;
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function initializeChessContract() {
    const contract = await getContract(true);
    await contract.initializeBoard();
}

export async function movePiece(fromRow, fromCol, toRow, toCol) {
    const contract = await getContract(true);
    await contract.movePiece(fromRow, fromCol, toRow, toCol);
}

export async function declareWinner(winnerAddress) {
    const contract = await getContract(true);
    await contract.declareWinner(winnerAddress);
}

export async function getPiece(row, col) {
    const contract = await getContract();
    return contract.getPiece(row, col);
}

export async function getBoard() {
    const contract = await getContract();
    return contract.board();
}

export async function getWinner() {
    const contract = await getContract();
    return contract.winner();
}

