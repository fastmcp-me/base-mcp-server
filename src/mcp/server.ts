import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { toolHandlers } from './tools.js';
import { isConnected } from '../blockchain/provider.js';

/**
 * Base MCP Server class
 */
export class BaseMcpServer {
  private server: Server;
  private customMethodHandlers: Map<string, (params: any) => Promise<any>> = new Map();
  
  constructor() {
    // Initialize the MCP server
    this.server = new Server(
      {
        name: 'base-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    // Set up request handlers
    this.setupToolHandlers();
    
    // Set up custom method handlers
    this.setupCustomMethodHandlers();
    
    // Set up error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }
  
  /**
   * Set up custom method handlers
   */
  private setupCustomMethodHandlers() {
    // Register listTools handler
    this.customMethodHandlers.set('listTools', async (params) => {
      const tools = [
        {
          name: 'process_command',
          description: 'Process a natural language command for Base network operations',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'Natural language command (e.g., "Send 0.1 ETH to 0x123...")',
              },
            },
            required: ['command'],
          },
        },
        {
          name: 'create_wallet',
          description: 'Create a new wallet',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Optional name for the wallet',
              },
            },
          },
        },
        {
          name: 'check_balance',
          description: 'Check wallet balance',
          inputSchema: {
            type: 'object',
            properties: {
              wallet: {
                type: 'string',
                description: 'Wallet name or address (defaults to primary wallet)',
              },
            },
          },
        },
        {
          name: 'list_wallets',
          description: 'List all available wallets',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ];
      
      return { tools };
    });
    
    // Register callTool handler
    this.customMethodHandlers.set('callTool', async (params) => {
      try {
        const name = params?.name;
        const args = params?.arguments || {};
        
        if (!name) {
          throw new Error('Tool name is required');
        }
        
        switch (name) {
          case 'process_command': {
            if (typeof args.command !== 'string' || !args.command) {
              throw new Error('Command is required and must be a string');
            }
            
            const result = await toolHandlers.processNaturalLanguageCommand(
              args.command
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'create_wallet': {
            const result = await toolHandlers.handleCreateWallet({
              name: typeof args.name === 'string' ? args.name : undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'check_balance': {
            const result = await toolHandlers.handleCheckBalance({
              wallet: typeof args.wallet === 'string' ? args.wallet : undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'list_wallets': {
            const result = toolHandlers.handleListWallets();
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error calling tool:`, error);
        
        throw error;
      }
    });
  }
  
  /**
   * Set up MCP tool handlers
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'process_command',
          description: 'Process a natural language command for Base network operations',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'Natural language command (e.g., "Send 0.1 ETH to 0x123...")',
              },
            },
            required: ['command'],
          },
        },
        {
          name: 'create_wallet',
          description: 'Create a new wallet',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Optional name for the wallet',
              },
            },
          },
        },
        {
          name: 'check_balance',
          description: 'Check wallet balance',
          inputSchema: {
            type: 'object',
            properties: {
              wallet: {
                type: 'string',
                description: 'Wallet name or address (defaults to primary wallet)',
              },
            },
          },
        },
        {
          name: 'list_wallets',
          description: 'List all available wallets',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));
    
    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const args = request.params.arguments || {};
        
        switch (request.params.name) {
          case 'process_command': {
            if (typeof args.command !== 'string' || !args.command) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'Command is required and must be a string'
              );
            }
            
            const result = await toolHandlers.processNaturalLanguageCommand(
              args.command
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'create_wallet': {
            const result = await toolHandlers.handleCreateWallet({
              name: typeof args.name === 'string' ? args.name : undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'check_balance': {
            const result = await toolHandlers.handleCheckBalance({
              wallet: typeof args.wallet === 'string' ? args.wallet : undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          case 'list_wallets': {
            const result = toolHandlers.handleListWallets();
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        console.error(`Error calling tool ${request.params.name}:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }
  
  /**
   * Start the MCP server
   */
  async start() {
    try {
      // Check connection to Base network
      const connected = await isConnected();
      if (!connected) {
        console.error('Failed to connect to Base network');
      }
      
      // Create a custom transport that handles our custom methods
      const transport = new StdioServerTransport();
      
      // Set up a listener for raw JSON-RPC messages
      const originalWrite = process.stdout.write;
      process.stdin.on('data', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          // Check if this is a method we want to handle
          if (message.method && this.customMethodHandlers.has(message.method)) {
            const handler = this.customMethodHandlers.get(message.method);
            if (handler) {
              try {
                const result = await handler(message.params);
                const response = {
                  jsonrpc: '2.0',
                  id: message.id,
                  result: result
                };
                originalWrite.call(process.stdout, JSON.stringify(response) + '\n');
              } catch (error) {
                const response = {
                  jsonrpc: '2.0',
                  id: message.id,
                  error: {
                    code: -32000,
                    message: error instanceof Error ? error.message : 'Unknown error'
                  }
                };
                originalWrite.call(process.stdout, JSON.stringify(response) + '\n');
              }
              return;
            }
          }
        } catch (error) {
          // Not a valid JSON message or other error, let the MCP server handle it
        }
      });
      
      // Connect to transport
      await this.server.connect(transport);
      
      console.error('Base MCP server running on stdio');
    } catch (error) {
      console.error('Error starting MCP server:', error);
      process.exit(1);
    }
  }
}
