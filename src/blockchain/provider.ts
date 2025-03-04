import { createPublicClient, http, parseGwei, type Chain, type PublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get provider URL from environment variables
const providerUrl = process.env.BASE_PROVIDER_URL || 'https://mainnet.base.org';

// Determine which chain to use based on the provider URL
export const chain: Chain = providerUrl.includes('sepolia') ? baseSepolia : base;
export const chainId = chain.id;
export const chainName = chain.name;

// Create public client instance
export const publicClient: PublicClient = createPublicClient({
  chain,
  transport: http(providerUrl)
}) as PublicClient;

// Get default gas price from environment variables or use default
export const defaultGasPrice = process.env.DEFAULT_GAS_PRICE 
  ? parseGwei(process.env.DEFAULT_GAS_PRICE)
  : parseGwei('5');

/**
 * Get the current gas price from the network
 * @returns Promise with the current gas price
 */
export async function getCurrentGasPrice(): Promise<bigint> {
  try {
    const gasPrice = await publicClient.getGasPrice();
    return gasPrice;
  } catch (error) {
    console.error('Error getting gas price:', error);
    return defaultGasPrice;
  }
}

/**
 * Check if the provider is connected to the network
 * @returns Promise with boolean indicating if connected
 */
export async function isConnected(): Promise<boolean> {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    console.log(`Connected to network: ${chainName} (${chainId})`);
    return true;
  } catch (error) {
    console.error('Error connecting to network:', error);
    return false;
  }
}
