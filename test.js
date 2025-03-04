#!/usr/bin/env node
import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Path to the MCP server executable
const serverPath = './dist/index.js';

// Start the MCP server as a child process
console.log('Starting Base MCP Server...');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Sample MCP tool call in JSON format
const createToolCall = (name, args) => {
  return JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now().toString(),
    method: 'callTool',
    params: {
      name,
      arguments: args
    }
  }) + '\n';
};

// Get list of tools
const getToolsList = () => {
  return JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now().toString(),
    method: 'listTools',
    params: {}
  }) + '\n';
};

// Wait for server to start
setTimeout(() => {
  console.log('\n=== Base MCP Server Test Client ===');
  console.log('Fetching available tools...');
  
  // Get list of tools
  server.stdin.write(getToolsList());
  
  // Show menu after a short delay
  setTimeout(() => {
    console.log('Available commands:');
    console.log('1. Create a wallet');
    console.log('2. Check wallet balance');
    console.log('3. Send transaction');
    console.log('4. Process natural language command');
    console.log('5. Exit');
    
    promptUser();
  }, 1000);
}, 1000);

// Handle server output
server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.result && response.result.content) {
      console.log('\nServer Response:');
      console.log(response.result.content[0].text);
    } else {
      console.log('\nRaw Server Response:', data.toString());
    }
    promptUser();
  } catch (error) {
    console.log('\nRaw Server Output:', data.toString());
    promptUser();
  }
});

// Prompt user for input
function promptUser() {
  rl.question('\nEnter command number: ', (answer) => {
    switch (answer) {
      case '1':
        rl.question('Enter wallet name (optional): ', (name) => {
          const args = name ? { name } : {};
          server.stdin.write(createToolCall('create_wallet', args));
        });
        break;
        
      case '2':
        rl.question('Enter wallet name or address (optional): ', (wallet) => {
          const args = wallet ? { wallet } : {};
          server.stdin.write(createToolCall('check_balance', args));
        });
        break;
        
      case '3':
        rl.question('Enter recipient address: ', (to) => {
          rl.question('Enter amount in ETH: ', (amount) => {
            rl.question('Enter sender wallet name (optional): ', (from) => {
              const args = {
                to,
                amount,
                ...(from ? { from } : {})
              };
              server.stdin.write(createToolCall('process_command', {
                command: `Send ${amount} ETH to ${to}${from ? ` from ${from}` : ''}`
              }));
            });
          });
        });
        break;
        
      case '4':
        rl.question('Enter natural language command: ', (command) => {
          server.stdin.write(createToolCall('process_command', { command }));
        });
        break;
        
      case '5':
        console.log('Exiting...');
        server.kill();
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log('Invalid command. Please try again.');
        promptUser();
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill();
  rl.close();
  process.exit(0);
});
