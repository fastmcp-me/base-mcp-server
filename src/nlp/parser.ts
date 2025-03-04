import { CommandIntent, ParsedCommand } from '../types.js';
import { intentPatterns, extractParameters } from './intents.js';

/**
 * Parse a natural language command
 * @param text The command text to parse
 * @returns Parsed command with intent and parameters
 */
export function parseCommand(text: string): ParsedCommand {
  // Default to unknown intent
  let intent = CommandIntent.UNKNOWN;
  let parameters: Record<string, any> = {};
  
  // Normalize text
  const normalizedText = text.trim().toLowerCase();
  
  // Try to match against known intent patterns
  for (const [intentType, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      const matches = pattern.exec(normalizedText);
      
      if (matches) {
        intent = intentType as CommandIntent;
        parameters = extractParameters(intent, normalizedText, matches);
        break;
      }
    }
    
    // If we found a match, stop checking other intents
    if (intent !== CommandIntent.UNKNOWN) {
      break;
    }
  }
  
  // Clean up and validate parameters
  parameters = cleanParameters(intent, parameters);
  
  return {
    intent,
    parameters,
    originalText: text
  };
}

/**
 * Clean and validate parameters based on intent
 * @param intent The command intent
 * @param parameters The extracted parameters
 * @returns Cleaned parameters
 */
function cleanParameters(
  intent: CommandIntent,
  parameters: Record<string, any>
): Record<string, any> {
  switch (intent) {
    case CommandIntent.SEND_TRANSACTION: {
      // Ensure address has 0x prefix
      if (parameters.to && !parameters.to.startsWith('0x')) {
        parameters.to = `0x${parameters.to}`;
      }
      
      // Validate amount
      if (parameters.amount && isNaN(parseFloat(parameters.amount))) {
        throw new Error(`Invalid amount: ${parameters.amount}`);
      }
      
      return parameters;
    }
    
    case CommandIntent.CHECK_BALANCE: {
      // Nothing special to clean for balance checks
      return parameters;
    }
    
    case CommandIntent.CREATE_WALLET: {
      // Ensure wallet name is valid
      if (parameters.name && !/^[a-zA-Z0-9_]+$/.test(parameters.name)) {
        throw new Error(`Invalid wallet name: ${parameters.name}. Use only letters, numbers, and underscores.`);
      }
      
      return parameters;
    }
    
    default:
      return parameters;
  }
}

/**
 * Generate a human-readable description of the parsed command
 * @param parsedCommand The parsed command
 * @returns Human-readable description
 */
export function generateCommandDescription(parsedCommand: ParsedCommand): string {
  const { intent, parameters } = parsedCommand;
  
  switch (intent) {
    case CommandIntent.SEND_TRANSACTION:
      return `Send ${parameters.amount} ${parameters.asset} to ${parameters.to}${
        parameters.from ? ` from wallet "${parameters.from}"` : ''
      }`;
    
    case CommandIntent.CHECK_BALANCE:
      return `Check balance of ${parameters.wallet ? `wallet "${parameters.wallet}"` : 'default wallet'}`;
    
    case CommandIntent.CREATE_WALLET:
      return `Create a new wallet${parameters.name ? ` named "${parameters.name}"` : ''}`;
    
    case CommandIntent.UNKNOWN:
      return `Unknown command: "${parsedCommand.originalText}"`;
    
    default:
      return `Command: ${parsedCommand.originalText}`;
  }
}
