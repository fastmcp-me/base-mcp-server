#!/usr/bin/env node
import { BaseMcpServer } from './mcp/server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Print banner
console.error(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║             Base MCP Server v0.1.0               ║
║                                                  ║
║  Natural Language Interface for Base Network     ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

// Start the server
const server = new BaseMcpServer();
server.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
