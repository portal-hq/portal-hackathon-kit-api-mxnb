![Portal Logo](https://cdn.prod.website-files.com/66a9400bd5456b4248f11c92/66a940c97f391719bd5ba2b9_Portal%20logo%201.png)

# Portal Hackathon Kit - Enclave MPC API

This repository shows you how you can easily integrate `CELO` into a Next.js server-side application using the [Portal Enclave MPC API](https://docs.portalhq.io/guides/enclave-mpc-api) for either an API or web app. It covers the following features.

1. Generate a wallet.
2. Fetch and display balances.
3. Fund wallet with CELO on Celo Alfajores Testnet.
4. Transfer tokens.

## How to Run This Example App

1. Clone the repo to your local system
2. Open the project in your editor of choice.
3. Run `yarn` to install dependencies.
4. Go to your Portal Dashboard [settings page](https://app.portalhq.io/settings#client-api-keys) and create a Portal API key.
5. Create a copy of `.env.example` to `.env.local` and paste the Portal API key.
6. Run `yarn dev` to start the application.

Once the application has started you can either:

1. Go to `localhost:3000` to see the web application.
2. Start sending requests to the API directly.

Here are some example cURL commands to test the API endpoints:

```bash
# Create a new wallet
curl -X POST http://localhost:3000/api/wallets

# List all wallets
curl -X GET http://localhost:3000/api/wallets
```

The API endpoints support the following operations:

- `POST /api/wallets`: Creates a new wallet with both ED25519 and SECP256K1 key pairs
- `GET /api/wallets`: Lists all wallets associated with your Portal account

Each response will include a `success` boolean and either `data` or `error` field:

```json
{
  "success": true,
  "data": {
    // Wallet or client data
  }
}
```

**Note**: This application is designed to be stateless, with one exception - the signing shares are stored in a local file-based database (LowDB) for demonstration purposes. In a production environment, you would want to use a more robust database solution and implement proper security measures for storing these sensitive keys.

## Understanding the Example App

This example application is built using Next.js and demonstrates how to integrate Portal's Enclave MPC API into a modern web application. Here's a breakdown of the project structure:

- `/src/app`: Contains the main application routes and pages using Next.js App Router
- `/src/lib`: Houses utility functions and API clients for interacting with Portal's services
- `/src/pages`: Contains additional pages using the Pages Router (for backward compatibility)
- `/src/types`: TypeScript type definitions for the application

The application uses several key technologies:

- Next.js 15 for the framework
- React 19 for the UI
- TypeScript for type safety
- TailwindCSS for styling
- Axios for HTTP requests
- LowDB for local data persistence

The project is set up with modern development tools including:

- ESLint for code linting
- TypeScript for type checking
- PostCSS for CSS processing
- Turbopack for fast development builds

The application demonstrates three core Portal Enclave MPC API features:

1. Wallet generation and management
2. Balance fetching and display
3. Token transfer functionality

## Faucets for Testing

You can get more `CELO` tokens for testing with the below faucet.

- [Alfajores Testnet Faucet](https://faucet.celo.org/alfajores) - Get testnet CELO tokens

If you need tokens other than `CELO`, we recommend getting testnet `CELO` and swapping them via Mento's DEX:

- [Mento App](https://app.mento.org/) - Swap between `CELO`, `cUSD`, `USDC`, `USDT`, and more

## Portal Documentation

### Portal Enclave MPC API Reference

Portal's Enclave MPC API has several pieces of core functionality.

- [Generating a Wallet](https://docs.portalhq.io/guides/enclave-mpc-api/create-a-wallet): This endpoint creates MPC key shares on your local device and the Portal servers. These key shares support all EVM chains and Solana.
- [Transferring Tokens](https://docs.portalhq.io/guides/enclave-mpc-api/send-tokens): This endpoint enables you to transfer tokens in an easy-to-use single endpoint.
- [Signing a Transaction](https://docs.portalhq.io/guides/enclave-mpc-api/sign-ethereum-transactions): This endpoint signs a provided transaction, and can broadcast that transaction to a chain when an RPC gateway URL is provided.

### Portal APIs

Portal supplies several additional APIs for simplifying your development.

- [Get Assets](https://docs.portalhq.io/reference/client-api/v3-endpoints#get-assets-by-chain): This endpoint returns a list of fungible asset (native, ERC-20, and SPL tokens) associated with your client for a given chain.
- [Get NFTs](https://docs.portalhq.io/reference/client-api/v3-endpoints#get-nft-assets-by-chain): This endpoint returns a list of the NFTs associated with your client for a given chain.
- [Get Transactions](https://docs.portalhq.io/reference/client-api/v3-endpoints#get-transactions-by-chain): This endpoint returns a list of the historic transactions associated with your client for a given chain.
- [Build a Transaction - Send Asset](https://docs.portalhq.io/reference/client-api/v3-endpoints#build-a-send-asset-transaction): This endpoint builds a formatted transaction to send a fungible asset (native, ERC-20, and SPL tokens) for a given chain.
- [Evaluate a Transaction](https://docs.portalhq.io/reference/client-api/v3-endpoints#evaluate-a-transaction): This endpoint can simulate a transaction and/or scan a transaction for security concerns.

### CELO Documentation

- [Celo Docs](https://docs.celo.org/) - Official Celo documentation
- [Mento Protocol](https://www.mento.org/) - Celo's stablecoin protocol

### Other Helpful Resources

- [What is Portal MPC?](https://docs.portalhq.io/resources/portals-mpc-architecture)

## Help

Need help or want to request a feature? Reach out to us on the [official Portal Community Slack](https://portalcommunity.slack.com/archives/C07EZFF9N78).
