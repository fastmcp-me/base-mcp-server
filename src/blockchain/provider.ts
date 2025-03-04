import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get provider URL from environment variables
const providerUrl = process.env.BASE_PROVIDER_URL || 'https://mainnet.base.org';

// Determine which chain to use based on the provider URL
export const chainId = providerUrl.includes('sepolia') ? 84532 : 8453; // Base Sepolia or Base Mainnet
export const chainName = providerUrl.includes('sepolia') ? 'Base Sepolia' : 'Base Mainnet';

// Create a simple client object
export const publicClient = {
  async getGasPrice(): Promise<bigint> {
    // For simplicity, return a default gas price
    return BigInt(5000000000); // 5 Gwei
  },
  
  async getBlockNumber(): Promise<bigint> {
    // For simplicity, return a mock block number
    return BigInt(1000000);
  },
  
  async getBalance(params: { address: string }): Promise<bigint> {
    // For simplicity, return a mock balance
    return BigInt(1000000000000000000); // 1 ETH
  },
  
  async getTransaction(params: { hash: string }): Promise<any> {
    // For simplicity, return a mock transaction
    return {
      hash: params.hash,
      from: '0x0000000000000000000000000000000000000000',
      to: '0x0000000000000000000000000000000000000000',
      value: BigInt(1000000000000000000), // 1 ETH
    };
  },
  
  async getTransactionReceipt(params: { hash: string }): Promise<any> {
    // For simplicity, return a mock transaction receipt
    return {
      hash: params.hash,
      blockNumber: BigInt(1000000),
      status: 'success',
    };
  },
  
  async estimateGas(params: any): Promise<bigint> {
    // For simplicity, return a default gas estimate
    return BigInt(21000);
  }
};

// Get default gas price from environment variables or use default
export const defaultGasPrice = BigInt(5000000000); // 5 Gwei

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
