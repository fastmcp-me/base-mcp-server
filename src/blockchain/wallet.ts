import { Wallet, WalletStore } from '../types.js';
import { chain, publicClient } from './provider.js';
import { createWalletClient, http, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { generatePrivateKey } from 'viem/accounts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// In-memory wallet store
const walletStore: WalletStore = {};

// Initialize default wallet from environment if available
if (process.env.WALLET_PRIVATE_KEY) {
  try {
    const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
    const account = privateKeyToAccount(privateKey);
    
    walletStore['default'] = {
      address: account.address,
      privateKey: privateKey,
      name: 'default'
    };
    
    console.log(`Initialized default wallet: ${account.address}`);
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
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  
  // Use provided name or generate a random one
  const walletName = name || `wallet_${Object.keys(walletStore).length + 1}`;
  
  // Store the wallet
  const wallet: Wallet = {
    address: account.address,
    privateKey: privateKey,
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
      address: wallet.address as `0x${string}`
    });
    
    return formatEther(balance);
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
  
  const account = privateKeyToAccount(wallet.privateKey as `0x${string}`);
  
  return createWalletClient({
    account,
    chain,
    transport: http()
  });
}
