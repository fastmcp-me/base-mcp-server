# Base MCP Server

A Model Context Protocol (MCP) service for the Base network that transforms complex blockchain operations into simple, natural language interactions.

## Features

- **Natural Language Command Processing**: Execute blockchain operations using simple English commands
- **Wallet Management**: Create and manage multiple wallets
- **Transaction Execution**: Send ETH to any address with simple commands
- **Balance Checking**: Check wallet balances easily

## Implementation Notes

### Mock Implementation

**IMPORTANT**: This implementation provides a simplified blockchain interaction layer that **mocks** the actual blockchain operations. It does not perform real blockchain transactions or interact with the actual Base network. Instead, it:

- Creates mock wallets with deterministic addresses
- Returns fixed values for balances (always shows 1 ETH)
- Generates random transaction hashes for "sent" transactions
- Simulates blockchain operations without actually executing them

This approach allows for testing the MCP server functionality without requiring a real connection to the Base network or real cryptocurrency. In a production environment, you would replace these mock implementations with real blockchain interactions using the Base network API.

### Production Considerations

To convert this mock implementation to a production-ready solution, you would need to:

1. Replace the mock blockchain interactions with real Base network API calls
2. Implement proper wallet management with secure key storage
3. Add transaction validation and error handling for real network conditions
4. Implement proper gas estimation and fee management
5. Add security measures for private key protection

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

To extend this implementation, you could:

1. Replace the mock blockchain interactions with real Base network API calls
2. Add support for token transfers beyond just ETH
3. Implement more complex DeFi operations
4. Enhance security features
5. Add comprehensive error handling
6. Create detailed documentation

## Security Considerations

- **Private Keys**: Never share your private keys or commit them to version control
- **Testing**: Use testnet for development and testing
- **Production**: Consider using a secure key management solution for production deployments

## License

MIT
