[![Add to Cursor](https://fastmcp.me/badges/cursor_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)
[![Add to VS Code](https://fastmcp.me/badges/vscode_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)
[![Add to Claude](https://fastmcp.me/badges/claude_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)
[![Add to ChatGPT](https://fastmcp.me/badges/chatgpt_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)
[![Add to Codex](https://fastmcp.me/badges/codex_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)
[![Add to Gemini](https://fastmcp.me/badges/gemini_dark.svg)](https://fastmcp.me/MCP/Details/657/base-blockchain)

# base-network-mcp-server

This is an MCP server for the Base network. It allows LLMs to perform blockchain operations on the Base network through natural language commands, including wallet management, balance checking, and transaction execution.

This server works with both Base Mainnet and Base Sepolia testnet.

## Tools

The following tools are available:

### process_command

Processes a natural language command for Base network operations. It accepts the following arguments:

- `command`: The natural language command to process (e.g., "Send 0.5 ETH to 0x1234...")

It returns a structured response with the result of the operation, including transaction details for send operations, balance information for balance checks, and wallet details for wallet creation.

### create_wallet

Creates a new wallet on the Base network. It accepts the following arguments:

- `name`: (Optional) A name for the wallet

It returns an object containing the wallet address, name, and other details.

### check_balance

Checks the balance of a wallet on the Base network. It accepts the following arguments:

- `wallet`: (Optional) The wallet name or address to check (defaults to the primary wallet)

It returns the wallet balance in ETH.

### list_wallets

Lists all available wallets.

It returns an array of wallet objects, each containing the wallet address, name, and other details.

## Usage

### With Claude Desktop

Claude Desktop is a popular LLM client that supports the Model Context Protocol. You can connect your Base MCP server to Claude Desktop to perform blockchain operations via natural language commands.

You can add MCP servers to Claude Desktop via its config file at:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

To add your Base MCP server to Claude Desktop, add the following configuration to the `mcpServers` object in the config file:

```json
{
  "mcpServers": {
    "base": {
      "command": "npx",
      "args": [
        "-y",
        "base-network-mcp-server"
      ],
      "env": {
        "BASE_PROVIDER_URL": "https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY",
        "WALLET_PRIVATE_KEY": "your_private_key_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Configuration

- `BASE_PROVIDER_URL`: The URL of the Base network provider (Mainnet or Sepolia)
- `WALLET_PRIVATE_KEY`: Your wallet private key for authentication and transaction signing
- `DEFAULT_GAS_PRICE`: (Optional) Default gas price in Gwei

### Programmatically (custom MCP client)

If you're building your own MCP client, you can connect to the Base MCP server programmatically using your preferred transport. The MCP SDK offers built-in stdio and SSE transports.

## Installation

```bash
npm i base-network-mcp-server
# or
yarn add base-network-mcp-server
# or
pnpm add base-network-mcp-server
```

## Example

The following example uses the StreamTransport to connect directly between an MCP client and server:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamTransport } from '@modelcontextprotocol/sdk/client/stream.js';
import { BaseMcpServer } from 'base-network-mcp-server';

// Create a stream transport for both client and server
const clientTransport = new StreamTransport();
const serverTransport = new StreamTransport();

// Connect the streams together
clientTransport.readable.pipeTo(serverTransport.writable);
serverTransport.readable.pipeTo(clientTransport.writable);

const client = new Client(
  {
    name: 'MyClient',
    version: '0.1.0',
  },
  {
    capabilities: {},
  }
);

// Create and configure the Base MCP server
const server = new BaseMcpServer({
  providerUrl: 'https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY',
  privateKey: 'your_private_key_here',
});

// Connect the client and server to their respective transports
await server.connect(serverTransport);
await client.connect(clientTransport);

// Call tools
const output = await client.callTool({
  name: 'process_command',
  arguments: {
    command: 'Check my wallet balance',
  },
});

console.log(output);
// Example output:
// {
//   "success": true,
//   "message": "Balance of wallet \"default\": 1.5 ETH",
//   "balance": "1.5",
//   "wallet": "default"
// }
```

## Example Commands

Once integrated, you can use natural language commands like:

- "Create a new wallet for savings"
- "Check my wallet balance"
- "What's the balance of my savings wallet?"
- "Send 0.1 ETH to 0x1234567890123456789012345678901234567890"
- "Transfer 0.5 ETH from my savings wallet to 0xABCD..."

## Security Considerations

Since this implementation interacts with real blockchain networks and handles private keys:

1. **Private Key Security**: Store private keys securely and never commit them to version control
2. **Use Testnet First**: Start with Base Sepolia testnet before moving to mainnet
3. **Transaction Validation**: Always validate transaction parameters before sending
4. **Error Handling**: Implement robust error handling for network issues
5. **Rate Limiting**: Be aware of API rate limits when making frequent requests
