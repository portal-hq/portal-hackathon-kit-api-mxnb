export interface ChainConfig {
  id: string;
  name: string;
  chainId: string;
  rpcUrl: string;
}

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    id: "arbitrum",
    name: "Arbitrum One Mainnet",
    chainId: "eip155:42161",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/42161",
  },
  {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    chainId: "eip155:421614",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/421614",
  },
  {
    id: "avalanche",
    name: "Avalanche Mainnet",
    chainId: "eip155:43114",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/43114",
  },
  {
    id: "base",
    name: "Base Mainnet",
    chainId: "eip155:8453",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/8453",
  },
  {
    id: "base-sepolia",
    name: "Base Sepolia",
    chainId: "eip155:84531",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/84531",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    chainId: "bip122:000000000019d6689c085ae165831e93-p2wpkh",
    rpcUrl:
      "https://api.portalhq.io/rpc/v1/bip122/000000000019d6689c085ae165831e93-p2wpkh",
  },
  {
    id: "celo",
    name: "Celo",
    chainId: "eip155:42220",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/42220",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: "eip155:1",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/1",
  },
  {
    id: "sepolia",
    name: "Ethereum Sepolia",
    chainId: "eip155:11155111",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/11155111",
  },
  {
    id: "optimism",
    name: "Optimism",
    chainId: "eip155:10",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/10",
  },
  {
    id: "optimism-sepolia",
    name: "Optimism Sepolia",
    chainId: "eip155:11155420",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/11155420",
  },
  {
    id: "polygon",
    name: "Polygon",
    chainId: "eip155:137",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/137",
  },
  {
    id: "polygon-sepolia",
    name: "Polygon Sepolia",
    chainId: "eip155:80001",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/80001",
  },
  {
    id: "solana",
    name: "Solana",
    chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    rpcUrl:
      "https://api.portalhq.io/rpc/v1/solana/5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  },
  {
    id: "solana-devnet",
    name: "Solana Devnet",
    chainId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
    rpcUrl:
      "https://api.portalhq.io/rpc/v1/solana/EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  },
  {
    id: "stellar",
    name: "Stellar",
    chainId: "stellar:pubnet",
    rpcUrl: "https://api.portalhq.io/rpc/v1/stellar/pubnet",
  },
  {
    id: "stellar-testnet",
    name: "Stellar Testnet",
    chainId: "stellar:testnet",
    rpcUrl: "https://api.portalhq.io/rpc/v1/stellar/testnet",
  },
  {
    id: "tron",
    name: "Tron",
    chainId: "tron:mainnet",
    rpcUrl: "https://api.portalhq.io/rpc/v1/tron/mainnet",
  },
];

// Helper function to get RPC URL by chain ID
export function getRpcUrlByChainId(chainId: string): string | undefined {
  return CHAIN_CONFIGS.find((config) => config.chainId === chainId)?.rpcUrl;
}
