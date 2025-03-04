import { TransactionRequest, TransactionResponse } from '../types.js';
import { publicClient, getCurrentGasPrice } from './provider.js';
import { getWalletClient, getDefaultWallet, getWallet } from './wallet.js';

/**
 * Send a transaction on the Base network
 * @param request Transaction request details
 * @returns Promise with transaction response
 */
export async function sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
  try {
    // Determine the sender wallet
    const walletName = request.from || (getDefaultWallet()?.name || 'default');
    const wallet = getWallet(walletName);
    
    if (!wallet) {
      throw new Error(`Sender wallet not found: ${walletName}`);
    }
    
    const walletClient = getWalletClient(walletName);
    
    // Convert ETH value to wei (1 ETH = 10^18 wei)
    const valueInWei = BigInt(parseFloat(request.value) * 1e18);
    
    // Get current gas price if not specified
    const gasPrice = request.gasPrice 
      ? BigInt(request.gasPrice)
      : await getCurrentGasPrice();
    
    console.log(`Sending transaction: ${request.value} ETH from ${wallet.address} to ${request.to}`);
    
    // Send transaction
    const hash = await walletClient.sendTransaction({
      account: walletClient.account,
      to: request.to,
      value: valueInWei,
      gasPrice: gasPrice,
      gas: request.gasLimit ? BigInt(request.gasLimit) : undefined
    });
    
    console.log(`Transaction sent with hash: ${hash}`);
    
    // Return transaction details
    return {
      hash: hash,
      from: wallet.address,
      to: request.to,
      value: request.value,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

/**
 * Get transaction details by hash
 * @param txHash Transaction hash
 * @returns Promise with transaction details
 */
export async function getTransaction(txHash: string): Promise<TransactionResponse | null> {
  try {
    const tx = await publicClient.getTransaction({
      hash: txHash
    });
    
    if (!tx) {
      return null;
    }
    
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash
    });
    
    return {
      hash: txHash,
      from: tx.from,
      to: tx.to || '',
      value: (Number(tx.value) / 1e18).toString(), // Convert from wei to ETH
      blockNumber: receipt?.blockNumber,
      status: receipt?.status === 'success' ? 'confirmed' : 'failed'
    };
  } catch (error) {
    console.error(`Error getting transaction ${txHash}:`, error);
    throw error;
  }
}

/**
 * Estimate gas for a transaction
 * @param request Transaction request
 * @returns Promise with estimated gas limit
 */
export async function estimateGas(request: TransactionRequest): Promise<string> {
  try {
    const walletName = request.from || (getDefaultWallet()?.name || 'default');
    const wallet = getWallet(walletName);
    
    if (!wallet) {
      throw new Error(`Sender wallet not found: ${walletName}`);
    }
    
    // Convert ETH value to wei (1 ETH = 10^18 wei)
    const valueInWei = BigInt(parseFloat(request.value) * 1e18);
    
    const gasEstimate = await publicClient.estimateGas({
      account: wallet.address,
      to: request.to,
      value: valueInWei
    });
    
    // Add a buffer to the estimate (10%)
    const gasWithBuffer = gasEstimate * BigInt(110) / BigInt(100);
    
    return gasWithBuffer.toString();
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
}
