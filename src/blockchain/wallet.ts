import { Wallet, WalletStore } from '../types.js';
import { publicClient, chainId, chainName } from './provider.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// In-memory wallet store
const walletStore: WalletStore = {};

// Initialize default wallet from environment if available
if (process.env.WALLET_PRIVATE_KEY) {
  try {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    // Generate a deterministic address from the private key
    const address = `0x${crypto.createHash('sha256').update(privateKey).digest('hex').substring(0, 40)}`;
    
    walletStore['default'] = {
      address,
      privateKey,
      name: 'default'
    };
    
    console.log(`Initialized default wallet: ${address}`);
  } catch (error) {
    console.error('Error initializing default wallet:', error);
  }
}

/**
 * Create a new wallet with an optional name
 * @param name Optional name for the wallet
 * @returns The created wallet
 */
export function createWallet(name?: string): Wallet {
  // Generate a random private key
  const privateKey = `0x${crypto.randomBytes(32).toString('hex')}`;
  // Generate a deterministic address from the private key
  const address = `0x${crypto.createHash('sha256').update(privateKey).digest('hex').substring(0, 40)}`;
  
  // Use provided name or generate a random one
  const walletName = name || `wallet_${Object.keys(walletStore).length + 1}`;
  
  // Store the wallet
  const wallet: Wallet = {
    address,
    privateKey,
    name: walletName
  };
  
  walletStore[walletName] = wallet;
  console.log(`Created new wallet: ${wallet.address} with name: ${walletName}`);
  
  return wallet;
}

/**
 * Get a wallet by name or address
 * @param nameOrAddress Wallet name or address
 * @returns The wallet or undefined if not found
 */
export function getWallet(nameOrAddress: string): Wallet | undefined {
  // Check if wallet exists by name
  if (walletStore[nameOrAddress]) {
    return walletStore[nameOrAddress];
  }
  
  // Check if wallet exists by address
  const walletByAddress = Object.values(walletStore).find(
    wallet => wallet.address.toLowerCase() === nameOrAddress.toLowerCase()
  );
  
  return walletByAddress;
}

/**
 * Get all wallets
 * @returns Array of all wallets
 */
export function getAllWallets(): Wallet[] {
  return Object.values(walletStore);
}

/**
 * Get the default wallet
 * @returns The default wallet or undefined if not set
 */
export function getDefaultWallet(): Wallet | undefined {
  return walletStore['default'] || Object.values(walletStore)[0];
}

/**
 * Get wallet balance
 * @param nameOrAddress Wallet name or address
 * @returns Promise with the balance in ETH
 */
export async function getWalletBalance(nameOrAddress: string): Promise<string> {
  const wallet = getWallet(nameOrAddress);
  
  if (!wallet) {
    throw new Error(`Wallet not found: ${nameOrAddress}`);
  }
  
  try {
    const balance = await publicClient.getBalance({
      address: wallet.address
    });
    
    // Convert from wei to ETH (1 ETH = 10^18 wei)
    return (Number(balance) / 1e18).toString();
  } catch (error) {
    console.error(`Error getting balance for wallet ${wallet.address}:`, error);
    throw error;
  }
}

/**
 * Get a wallet client for signing transactions
 * @param nameOrAddress Wallet name or address
 * @returns Wallet client instance
 */
export function getWalletClient(nameOrAddress: string): any {
  const wallet = getWallet(nameOrAddress);
  
  if (!wallet) {
    throw new Error(`Wallet not found: ${nameOrAddress}`);
  }
  
  // Create a simple wallet client
  return {
    account: {
      address: wallet.address,
      privateKey: wallet.privateKey
    },
    async sendTransaction(params: any): Promise<string> {
      console.log(`Mock sending transaction from ${params.account.address} to ${params.to} with value ${params.value}`);
      // Generate a random transaction hash
      const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
      return txHash;
    }
  };
}
