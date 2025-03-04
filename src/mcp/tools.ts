import { CommandIntent, CreateWalletArgs, SendTransactionArgs, CheckBalanceArgs } from '../types.js';
import { createWallet, getWalletBalance, getDefaultWallet, getAllWallets } from '../blockchain/wallet.js';
import { sendTransaction } from '../blockchain/transaction.js';
import { parseCommand, generateCommandDescription } from '../nlp/parser.js';

/**
 * Process a natural language command
 * @param command The natural language command
 * @returns Result of processing the command
 */
export async function processNaturalLanguageCommand(command: string): Promise<any> {
  try {
    // Parse the command
    const parsedCommand = parseCommand(command);
    console.log(`Parsed command: ${JSON.stringify(parsedCommand)}`);
    
    // Generate human-readable description
    const description = generateCommandDescription(parsedCommand);
    console.log(`Command description: ${description}`);
    
    // Process based on intent
    switch (parsedCommand.intent) {
      case CommandIntent.SEND_TRANSACTION:
        return await handleSendTransaction(parsedCommand.parameters as SendTransactionArgs);
      
      case CommandIntent.CHECK_BALANCE:
        return await handleCheckBalance(parsedCommand.parameters as CheckBalanceArgs);
      
      case CommandIntent.CREATE_WALLET:
        return await handleCreateWallet(parsedCommand.parameters as CreateWalletArgs);
      
      case CommandIntent.UNKNOWN:
      default:
        return {
          success: false,
          message: `I couldn't understand that command. Try something like "Send 0.1 ETH to 0x123..." or "Create a new wallet".`,
          originalCommand: command
        };
    }
  } catch (error) {
    console.error('Error processing command:', error);
    return {
      success: false,
      message: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
      originalCommand: command
    };
  }
}

/**
 * Handle send transaction command
 * @param args Send transaction arguments
 * @returns Transaction result
 */
async function handleSendTransaction(args: SendTransactionArgs): Promise<any> {
  try {
    // Validate required parameters
    if (!args.to) {
      throw new Error('Recipient address is required');
    }
    
    if (!args.amount) {
      throw new Error('Amount is required');
    }
    
    // Send the transaction
    const txResponse = await sendTransaction({
      from: args.from || (getDefaultWallet()?.name || 'default'),
      to: args.to,
      value: args.amount
    });
    
    return {
      success: true,
      message: `Transaction sent successfully! Hash: ${txResponse.hash}`,
      transaction: txResponse
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

/**
 * Handle check balance command
 * @param args Check balance arguments
 * @returns Balance information
 */
async function handleCheckBalance(args: CheckBalanceArgs): Promise<any> {
  try {
    const walletName = args.wallet || (getDefaultWallet()?.name || 'default');
    const balance = await getWalletBalance(walletName);
    
    return {
      success: true,
      message: `Balance of wallet "${walletName}": ${balance} ETH`,
      balance,
      wallet: walletName
    };
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
}

/**
 * Handle create wallet command
 * @param args Create wallet arguments
 * @returns Wallet information
 */
async function handleCreateWallet(args: CreateWalletArgs): Promise<any> {
  try {
    const wallet = createWallet(args.name);
    
    return {
      success: true,
      message: `Created new wallet "${wallet.name}" with address ${wallet.address}`,
      wallet: {
        name: wallet.name,
        address: wallet.address
      }
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

/**
 * List all wallets
 * @returns List of wallets
 */
function handleListWallets(): any {
  try {
    const wallets = getAllWallets();
    
    return {
      success: true,
      message: `Found ${wallets.length} wallet(s)`,
      wallets: wallets.map(wallet => ({
        name: wallet.name,
        address: wallet.address
      }))
    };
  } catch (error) {
    console.error('Error listing wallets:', error);
    throw error;
  }
}

// Export all handlers for use in the MCP server
export const toolHandlers = {
  processNaturalLanguageCommand,
  handleSendTransaction,
  handleCheckBalance,
  handleCreateWallet,
  handleListWallets
};
