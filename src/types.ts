/**
 * Types for the Base MCP Server
 */

// Wallet types
export interface Wallet {
  address: string;
  privateKey: string;
  name?: string;
}

export interface WalletStore {
  [name: string]: Wallet;
}

// Transaction types
export interface TransactionRequest {
  from: string;
  to: string;
  value: string; // In ETH
  gasLimit?: string;
  gasPrice?: string;
}

export interface TransactionResponse {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber?: bigint;
  timestamp?: number;
  status?: 'pending' | 'confirmed' | 'failed';
}

// NLP types
export interface ParsedCommand {
  intent: CommandIntent;
  parameters: Record<string, any>;
  originalText: string;
}

export enum CommandIntent {
  SEND_TRANSACTION = 'send_transaction',
  CHECK_BALANCE = 'check_balance',
  CREATE_WALLET = 'create_wallet',
  UNKNOWN = 'unknown'
}

// MCP Tool types
export interface SendTransactionArgs {
  from?: string; // Wallet name or address, defaults to primary wallet
  to: string; // Recipient address
  amount: string; // Amount in ETH
  asset?: string; // Asset type, defaults to ETH
}

export interface CheckBalanceArgs {
  wallet?: string; // Wallet name or address, defaults to primary wallet
  asset?: string; // Asset type, defaults to ETH
}

export interface CreateWalletArgs {
  name?: string; // Optional wallet name
}
