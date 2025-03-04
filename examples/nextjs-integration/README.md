# Next.js Integration Example

This example demonstrates how to integrate the Base MCP Server with a Next.js application.

## Setup

1. Create a new Next.js app:
```bash
npx create-next-app@latest base-mcp-nextjs --typescript
cd base-mcp-nextjs
```

2. Install required dependencies:
```bash
npm install @modelcontextprotocol/client
```

3. Create an MCP client utility:

```typescript
// lib/mcp/client.ts
import { Client } from '@modelcontextprotocol/client';

// Initialize MCP client
let mcpClient: Client | null = null;

export async function getMcpClient() {
  if (!mcpClient) {
    mcpClient = new Client();
    await mcpClient.connect();
  }
  return mcpClient;
}

// Process a natural language command for Base operations
export async function processBaseCommand(command: string) {
  const client = await getMcpClient();
  
  try {
    const result = await client.callTool('base', 'process_command', {
      command
    });
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error processing Base command:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Create a new wallet
export async function createWallet(name?: string) {
  const client = await getMcpClient();
  
  try {
    const result = await client.callTool('base', 'create_wallet', {
      name
    });
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check wallet balance
export async function checkBalance(wallet?: string) {
  const client = await getMcpClient();
  
  try {
    const result = await client.callTool('base', 'check_balance', {
      wallet
    });
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error checking balance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

4. Create a simple UI component:

```typescript
// components/BaseCommandInput.tsx
'use client';

import { useState } from 'react';
import { processBaseCommand } from '../lib/mcp/client';

export default function BaseCommandInput() {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await processBaseCommand(command);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Base Network Command</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter a command (e.g., 'Create a wallet for savings')"
          className="w-full p-2 border rounded mb-2"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Processing...' : 'Execute Command'}
        </button>
      </form>
      
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

5. Use the component in your page:

```typescript
// app/page.tsx
import BaseCommandInput from '../components/BaseCommandInput';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Base Network MCP Integration
      </h1>
      
      <BaseCommandInput />
    </main>
  );
}
```

## Running the Example

1. Make sure your Base MCP Server is running and configured in your MCP settings.
2. Start the Next.js development server:
```bash
npm run dev
```
3. Open your browser to http://localhost:3000
4. Enter natural language commands in the input field and see the results.

## Notes

- This example assumes you've configured the Base MCP Server with the server name "base" in your MCP settings.
- For production use, you would want to add proper error handling, loading states, and better UI feedback.
- You might want to add authentication to restrict who can execute blockchain operations.
