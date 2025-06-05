export interface TokenBalance {
  balance: string;
  decimals: number;
  name: string;
  rawBalance: string;
  symbol: string;
  metadata: {
    tokenAddress?: string;
    verifiedContract?: boolean;
    totalSupply?: string;
    rawTotalSupply?: string;
    percentageRelativeToTotalSupply?: number;
    logo?: string;
    thumbnail?: string;
    usdValue?: number;
  };
}

export interface NFT {
  nftId: string;
  name: string;
  description: string;
  imageUrl: string;
  chainId: string;
  contractAddress: string;
  tokenId: string;
  collection: {
    name: string;
    description: string;
    imageUrl: string;
  };
  lastSale: {
    price: string;
    currency: string;
    date: string;
  };
  rarity: {
    rank: number;
    score: number;
  };
  floorPrice: {
    price: string;
    currency: string;
  };
}

export interface WalletAssets {
  nativeBalance: TokenBalance;
  tokenBalances: TokenBalance[];
  nfts?: NFT[];
}

export interface Wallet {
  id: string;
  createdAt: string;
  ejectedAt: string | null;
  isAccountAbstracted: boolean;
  custodian: {
    id: string;
    name: string;
  };
  environment: {
    id: string;
    name: string;
  };
  metadata: {
    namespaces: {
      eip155: {
        address: string;
        curve: string;
      };
      solana: {
        address: string;
        curve: string;
      };
      tron: {
        address: string;
        curve: string;
      };
      stellar: {
        address: string;
        curve: string;
      };
    };
  };
  wallets: {
    id: string;
    createdAt: string;
    curve: string;
    publicKey: string;
    backupSharePairs: {
      id: string;
      backupMethod: string;
      createdAt: string;
      status: string;
    }[];
    signingSharePairs: {
      id: string;
      createdAt: string;
      status: string;
    }[];
  }[];
}

export interface Chain {
  id: string;
  name: string;
  chainId: string;
}

export const CHAINS: Chain[] = [
  {
    id: "solana",
    name: "Solana Mainnet",
    chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  },
  {
    id: "solana-devnet",
    name: "Solana Devnet",
    chainId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    chainId: "bip122:000000000019d6689c085ae165831e93-p2wpkh",
  },
  {
    id: "bitcoin-testnet",
    name: "Bitcoin Testnet",
    chainId: "bip122:000000000933ea01ad0ee984209779ba-p2wpkh",
  },
  { id: "tron", name: "Tron", chainId: "tron:mainnet" },
  { id: "tron-nile", name: "Tron Nile", chainId: "tron:nile" },
  { id: "tron-shasta", name: "Tron Shasta", chainId: "tron:shasta" },
  { id: "stellar", name: "Stellar", chainId: "stellar:pubnet" },
  {
    id: "stellar-testnet",
    name: "Stellar Testnet",
    chainId: "stellar:testnet",
  },
  { id: "ethereum", name: "Ethereum Mainnet", chainId: "eip155:1" },
  { id: "sepolia", name: "Ethereum Sepolia", chainId: "eip155:11155111" },
  { id: "base", name: "Base Mainnet", chainId: "eip155:8453" },
  { id: "base-sepolia", name: "Base Sepolia", chainId: "eip155:84532" },
  { id: "polygon", name: "Polygon Mainnet", chainId: "eip155:137" },
  { id: "polygon-amoy", name: "Polygon Amoy", chainId: "eip155:80002" },
  { id: "optimism", name: "Optimism Mainnet", chainId: "eip155:10" },
  { id: "bsc", name: "Binance Smart Chain", chainId: "eip155:56" },
  {
    id: "bsc-testnet",
    name: "Binance Smart Chain Testnet",
    chainId: "eip155:97",
  },
  { id: "fantom", name: "Fantom", chainId: "eip155:250" },
  { id: "moonbeam", name: "Moonbeam", chainId: "eip155:1284" },
  { id: "arbitrum", name: "Arbitrum Mainnet", chainId: "eip155:42161" },
  { id: "arbitrum-sepolia", name: "Arbitrum Sepolia", chainId: "eip155:421614" },
  { id: "avalanche", name: "Avalanche Mainnet", chainId: "eip155:43114" },
  { id: "linea", name: "Linea Mainnet", chainId: "eip155:59144" },
  { id: "celo", name: "Celo", chainId: "eip155:42220" },
  {
    id: "celo-alfajores",
    name: "Celo Alfajores Testnet",
    chainId: "eip155:44787",
  },
];
