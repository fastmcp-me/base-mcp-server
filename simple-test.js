#!/usr/bin/env node
import { spawn } from 'child_process';

// Path to the MCP server executable
const serverPath = './dist/index.js';

// Start the MCP server as a child process
console.log('Starting Base MCP Server...');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log('Server output:', data.toString());
});

// Wait for server to start
setTimeout(() => {
  console.log('Sending list_tools request...');
  
  // Send a request to list available tools
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: '1',
    method: 'listTools',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait a bit and then exit
  setTimeout(() => {
    console.log('Exiting...');
    server.kill();
    process.exit(0);
  }, 3000);
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill();
  process.exit(0);
});
