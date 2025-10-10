# @trustless/contracts

Foundry smart contracts for Trustless SocialFi platform.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Solidity 0.8.24

## Installation

```bash
# Install dependencies
forge install

# Install OpenZeppelin Contracts (already installed)
forge install OpenZeppelin/openzeppelin-contracts@v5.0.0
```

## Development

### Build

```bash
forge build
# or
pnpm build
```

### Test

```bash
forge test
# or
pnpm test

# Run tests with gas report
forge test --gas-report

# Run tests with verbosity
forge test -vvv
```

### Lint

```bash
pnpm lint
```

## Deployment

### Local Deployment (Anvil)

1. Start local testnet:

```bash
anvil
```

2. Deploy contracts (in another terminal):

```bash
forge script script/DeployHealthCheck.s.sol \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

### Testnet Deployment (Arbitrum Sepolia)

1. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

2. Update `.env` with your private key and RPC URLs

3. Deploy:

```bash
forge script script/DeployHealthCheck.s.sol \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ARBISCAN_API_KEY
```

## Project Structure

```
contracts/
├── src/              # Smart contract source files
│   └── HealthCheck.sol
├── test/             # Test files
│   └── HealthCheck.t.sol
├── script/           # Deployment scripts
│   └── DeployHealthCheck.s.sol
├── lib/              # Dependencies
│   ├── forge-std/
│   └── openzeppelin-contracts/
└── foundry.toml      # Foundry configuration
```

## Contracts

### HealthCheck

A simple "Hello World" contract to verify the development environment.

- `getMessage()`: Returns "Trustless SocialFi"
- `isAlive()`: Returns true

## Configuration

See `foundry.toml` for Foundry configuration:

- Solidity version: 0.8.24
- Optimizer: enabled (200 runs)
- RPC endpoints: Arbitrum, Sepolia, Local

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/)
- [Arbitrum Documentation](https://docs.arbitrum.io/)
