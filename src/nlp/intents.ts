import { CommandIntent } from '../types.js';

/**
 * Intent patterns for natural language command recognition
 */
export const intentPatterns = {
  [CommandIntent.SEND_TRANSACTION]: [
    /send\s+([\d\.]+)\s*(eth|ether)?\s*to\s+([0-9a-fA-Fx]+)/i,
    /transfer\s+([\d\.]+)\s*(eth|ether)?\s*to\s+([0-9a-fA-Fx]+)/i,
    /pay\s+([\d\.]+)\s*(eth|ether)?\s*to\s+([0-9a-fA-Fx]+)/i,
    /send\s+([\d\.]+)\s*(eth|ether)?\s*from\s+(\w+)\s+to\s+([0-9a-fA-Fx]+)/i,
  ],
  [CommandIntent.CHECK_BALANCE]: [
    /check\s+(balance|eth|ether)/i,
    /what('?s| is)\s+(my|the)\s+(balance|eth|ether)/i,
    /balance\s+of\s+(\w+)/i,
    /how\s+much\s+(eth|ether)/i,
  ],
  [CommandIntent.CREATE_WALLET]: [
    /create\s+(a\s+)?(new\s+)?wallet/i,
    /create\s+(a\s+)?(new\s+)?wallet\s+for\s+(\w+)/i,
    /generate\s+(a\s+)?(new\s+)?wallet/i,
    /make\s+(a\s+)?(new\s+)?wallet/i,
  ],
};

/**
 * Extract parameters from a command based on the intent
 * @param intent The recognized intent
 * @param command The original command text
 * @param matches The regex matches
 * @returns Extracted parameters
 */
export function extractParameters(
  intent: CommandIntent,
  command: string,
  matches: RegExpExecArray
): Record<string, any> {
  switch (intent) {
    case CommandIntent.SEND_TRANSACTION: {
      // Check if the command includes "from" wallet
      if (matches.length >= 5 && matches[3]) {
        return {
          amount: matches[1],
          asset: 'ETH',
          from: matches[3],
          to: matches[4],
        };
      }
      
      return {
        amount: matches[1],
        asset: 'ETH',
        to: matches[3],
      };
    }
    
    case CommandIntent.CHECK_BALANCE: {
      // Check if checking balance of specific wallet
      if (matches.length >= 2 && matches[1] && command.includes('of')) {
        return {
          wallet: matches[1],
          asset: 'ETH',
        };
      }
      
      return {
        asset: 'ETH',
      };
    }
    
    case CommandIntent.CREATE_WALLET: {
      // Check if creating wallet with specific name
      if (matches.length >= 4 && matches[3]) {
        return {
          name: matches[3],
        };
      }
      
      return {};
    }
    
    default:
      return {};
  }
}

/**
 * Validate Ethereum address
 * @param address Address to validate
 * @returns Boolean indicating if address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Validate amount
 * @param amount Amount to validate
 * @returns Boolean indicating if amount is valid
 */
export function isValidAmount(amount: string): boolean {
  return /^\d+(\.\d+)?$/.test(amount) && parseFloat(amount) > 0;
}
