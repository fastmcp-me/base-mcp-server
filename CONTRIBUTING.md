# Contributing to Base MCP Server

Thank you for considering contributing to Base MCP Server! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/base-mcp-server.git
   cd base-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:
   ```
   # Base Network Provider URL
   BASE_PROVIDER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY
   
   # Wallet Private Key (for testing only, use secure storage in production)
   WALLET_PRIVATE_KEY=your_private_key_here
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Run tests:
   ```bash
   npm test
   ```

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
├── test.js               # Interactive test client
└── package.json          # Project configuration
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for new features

## Pull Request Process

1. Ensure your code follows the project's code style
2. Update the README.md with details of changes if appropriate
3. Update the examples if necessary
4. The PR should work on the latest main branch
5. Include a description of the changes in your PR

## Adding New Features

When adding new features, please consider:

1. **Backward Compatibility**: Ensure your changes don't break existing functionality
2. **Documentation**: Update the README.md and add examples if necessary
3. **Testing**: Add tests for your new feature
4. **Error Handling**: Implement proper error handling

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
