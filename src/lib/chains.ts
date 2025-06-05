export interface ChainConfig {
  id: string;
  name: string;
  chainId: string;
  rpcUrl: string;
}

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    id: "arbitrum",
    name: "Arbitrum Mainnet",
    chainId: "eip155:42161",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/42161",
  },
  {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    chainId: "eip155:421614",
    rpcUrl: "https://api.portalhq.io/rpc/v1/eip155/421614",
  },
];

// Helper function to get RPC URL by chain ID
export function getRpcUrlByChainId(chainId: string): string | undefined {
  return CHAIN_CONFIGS.find((config) => config.chainId === chainId)?.rpcUrl;
}
