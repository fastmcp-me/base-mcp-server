# Base MCP Server

A Model Context Protocol (MCP) service for the Base network that transforms complex blockchain operations into simple, natural language interactions.

## Features

- **Natural Language Command Processing**: Execute blockchain operations using simple English commands
- **Wallet Management**: Create and manage multiple wallets
- **Transaction Execution**: Send ETH to any address with simple commands
- **Balance Checking**: Check wallet balances easily

## Implementation Notes

### Real Blockchain Implementation

This implementation uses real blockchain interactions with the Base network through the Coinbase API. It:

- Creates real wallets with cryptographically secure private keys
- Retrieves actual wallet balances from the blockchain
- Sends real transactions to the Base network
- Gets real-time gas prices and estimates

This allows for actual blockchain operations to be performed through natural language commands.

### Security Considerations

Since this implementation interacts with real blockchain networks and handles private keys:

1. **Private Key Security**: Store private keys securely and never commit them to version control
2. **Use Testnet First**: Start with Base Sepolia testnet before moving to mainnet
3. **Transaction Validation**: Always validate transaction parameters before sending
4. **Error Handling**: Implement robust error handling for network issues
5. **Rate Limiting**: Be aware of API rate limits when making frequent requests

## Prerequisites

- Node.js 16+
- Access to Base network (mainnet or testnet)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/base-mcp-server.git
   cd base-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the example:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:
   ```
   # Base Network Provider URL
   BASE_PROVIDER_URL=https://api.developer.coinbase.com/rpc/v1/base/ByeAFq6UvTNv18icKsOugFww7BO10Ez0
   
   # Wallet Private Key (for testing only, use secure storage in production)
   WALLET_PRIVATE_KEY=your_private_key_here
   ```

5. Build the project:
   ```
   npm run build
   ```

## Usage

### Running the Server

Start the MCP server:

```
npm start
```

### Testing the Server

For quick testing without integrating with an AI assistant, you can use the included test script:

```
npm run test
```

This will start an interactive test client that allows you to:
1. Create wallets
2. Check wallet balances
3. Send transactions
4. Process natural language commands

### MCP Integration

To use this MCP server with Claude or other AI assistants, add it to your MCP settings:

```json
{
  "mcpServers": {
    "base": {
      "command": "node",
      "args": ["/path/to/base-mcp-server/dist/index.js"],
      "env": {
        "BASE_PROVIDER_URL": "https://api.developer.coinbase.com/rpc/v1/base/ByeAFq6UvTNv18icKsOugFww7BO10Ez0",
        "WALLET_PRIVATE_KEY": "your_private_key_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Available Commands

Once integrated, you can use natural language commands like:

- **Create a wallet**: `Create a new wallet for savings`
- **Check balance**: `Check my wallet balance` or `What's the balance of my savings wallet?`
- **Send ETH**: `Send 0.1 ETH to 0x1234...` or `Transfer 0.5 ETH from my savings wallet to 0xABCD...`

## Project Structure

```
base-mcp-server/
├── src/
│   ├── blockchain/       # Blockchain integration
│   │   ├── provider.ts   # Network provider setup
│   │   ├── wallet.ts     # Wallet management
│   │   └── transaction.ts # Transaction handling
│   ├── nlp/              # Natural language processing
│   │   ├── parser.ts     # Command parsing
│   │   └── intents.ts    # Intent recognition
│   ├── mcp/              # MCP server implementation
│   │   ├── server.ts     # MCP server setup
│   │   └── tools.ts      # MCP tools implementation
│   ├── types.ts          # TypeScript type definitions
│   └── index.ts          # Entry point
├── examples/             # Integration examples
│   └── nextjs-integration/ # Next.js integration example
├── .env.example          # Example environment variables
├── test.js               # Interactive test client
└── package.json          # Project configuration
```

## Next Steps

To further enhance this implementation, you could:

1. Add support for token transfers beyond just ETH
2. Implement more complex DeFi operations
3. Add support for NFT interactions
4. Implement multi-chain support
5. Add comprehensive error handling
6. Create detailed documentation

## License

MIT
