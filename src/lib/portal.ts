import axios, { AxiosInstance } from "axios";
import { getRpcUrlByChainId } from "./chains";

interface PortalClientConfig {
  custodianApiKey: string;
  custodianUrl?: string;
  enclaveUrl?: string;
  clientUrl?: string;
}

interface CreateClientResponse {
  id: string;
  clientApiKey: string;
  clientSessionToken: string;
  isAccountAbstracted: boolean;
}

interface CreateClientSessionTokenResponse {
  id: string;
  clientSessionToken: string;
  isAccountAbstracted: boolean;
}

interface CreateWalletResponse {
  SECP256K1: {
    share: string;
    id: string;
  };
  ED25519: {
    share: string;
    id: string;
  };
}

interface SignTransactionResponse {
  signature: string;
  signedTransaction: string;
}

interface GetClientsResponse {
  results: GetClientResponse[];
}

interface GetClientResponse {
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

interface TokenMetadata {
  tokenAddress?: string;
  verifiedContract?: boolean;
  totalSupply?: string;
  rawTotalSupply?: string;
  percentageRelativeToTotalSupply?: number;
  logo?: string;
  thumbnail?: string;
}

interface TokenBalance {
  balance: string;
  decimals: number;
  name: string;
  rawBalance: string;
  symbol: string;
  metadata: TokenMetadata;
}

interface NFTAttribute {
  traitType: string;
  value: string;
  displayType: string | null;
}

interface NFTOwner {
  ownerAddress: string;
  quantity: number;
  firstAcquiredDate: string;
  lastAcquiredDate: string;
}

interface NFTCollectionInfo {
  bannerImageUrl: string;
  externalUrl: string;
  twitterUsername: string;
  discordUrl: string;
  instagramUsername: string;
  mediumUsername: string;
  telegramUrl: string;
  distinctOwnerCount: number;
  distinctNftCount: number;
  totalQuantity: number;
}

interface NFTSaleInfo {
  fromAddress: string;
  toAddress: string;
  priceUsdCents: number;
  transaction: string;
  marketplaceId: string;
  marketplaceName: string;
}

interface NFTPaymentToken {
  paymentTokenId: string;
  name: string;
  symbol: string;
  address: string | null;
  decimals: number;
}

interface NFTFloorPrice {
  value: string;
  paymentToken: NFTPaymentToken;
  valueUsdCents: number;
}

interface NFTMarketplace {
  marketplaceId: string;
  marketplaceName: string;
  marketplaceCollectionId: string;
  nftUrl: string;
  collectionUrl: string;
  verified: boolean;
  floorPrice: NFTFloorPrice;
}

interface NFTMediaPreviews {
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
  imageOpengraphUrl: string;
  blurhash: string;
  predominantColor: string;
}

interface NFTMediaInfo {
  previews: NFTMediaPreviews;
  animationUrl?: string;
  backgroundColor?: string;
}

interface NFTDetailedInfo {
  ownerCount: number;
  tokenCount: number;
  createdDate: string;
  attributes: NFTAttribute[];
  owners: NFTOwner[];
  extendedCollectionInfo: NFTCollectionInfo;
  extendedSaleInfo: NFTSaleInfo;
  marketplaceInfo: NFTMarketplace[];
  mediaInfo: NFTMediaInfo;
}

interface NFTCollection {
  name: string;
  description: string;
  imageUrl: string;
}

interface NFTLastSale {
  price: string;
  currency: string;
  date: string;
}

interface NFTRarity {
  rank: number;
  score: number;
}

interface NFTFloorPriceInfo {
  price: string;
  currency: string;
}

interface NFT {
  nftId: string;
  name: string;
  description: string;
  imageUrl: string;
  chainId: string;
  contractAddress: string;
  tokenId: string;
  collection: NFTCollection;
  lastSale: NFTLastSale;
  rarity: NFTRarity;
  floorPrice: NFTFloorPriceInfo;
  detailedInfo: NFTDetailedInfo;
}

export interface PortalAsset {
  nativeBalance: TokenBalance;
  tokenBalances: TokenBalance[];
  nfts: NFT[];
}

interface UpdateWalletStatusParams {
  status: "STORED_CLIENT";
  signingSharePairIds: string[];
}

export class PortalClient {
  private custodianApi: AxiosInstance;
  private clientApi: AxiosInstance;
  private enclaveApi: AxiosInstance;

  constructor(config: PortalClientConfig) {
    this.custodianApi = axios.create({
      baseURL:
        config.custodianUrl || "https://api.portalhq.io/api/v3/custodians",
      headers: {
        Authorization: `Bearer ${config.custodianApiKey}`,
        "Content-Type": "application/json",
      },
    });

    this.clientApi = axios.create({
      baseURL: config.clientUrl || "https://api.portalhq.io/api/v3/clients",
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.enclaveApi = axios.create({
      baseURL: config.enclaveUrl || "https://mpc-client.portalhq.io/v1",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createClient(): Promise<CreateClientResponse> {
    try {
      const response = await this.custodianApi.post("/me/clients");
      if (!response.data) {
        throw new Error("No data received from custodian API");
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create client: ${
            error.response?.data?.message || error.message
          }`
        );
      } else if (error instanceof Error) {
        throw new Error(`Failed to create client: ${error.message}`);
      }
      throw new Error("Failed to create client: Unknown error");
    }
  }

  async createWallet(clientApiKey: string): Promise<CreateWalletResponse> {
    try {
      const response = await this.enclaveApi.post(
        "/generate",
        {},
        {
          headers: { Authorization: `Bearer ${clientApiKey}` },
        }
      );
      if (!response.data) {
        throw new Error("No data received from enclave API");
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create wallet: ${
            error.response?.data?.message || error.message
          }`
        );
      } else if (error instanceof Error) {
        throw new Error(`Failed to create wallet: ${error.message}`);
      }
      throw new Error("Failed to create wallet: Unknown error");
    }
  }

  async getClient(clientId: string): Promise<GetClientResponse> {
    const response = await this.custodianApi.get(`/me/clients/${clientId}`);
    return response.data;
  }

  async getClients(): Promise<GetClientsResponse> {
    const response = await this.custodianApi.get(`/me/clients`);
    return response.data;
  }

  async createClientSessionToken(
    clientId: string
  ): Promise<CreateClientSessionTokenResponse> {
    try {
      const response = await this.custodianApi.post(
        `/me/clients/${clientId}/sessions`
      );
      if (!response.data) {
        throw new Error("No data received from custodian API");
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create client session token: ${
            error.response?.data?.message || error.message
          }`
        );
      } else if (error instanceof Error) {
        throw new Error(
          `Failed to create client session token: ${error.message}`
        );
      }
      throw new Error("Failed to create client session token: Unknown error");
    }
  }

  async transferAssets(
    clientApiKey: string,
    share: string,
    chain: string,
    to: string,
    amount: string,
    token: string
  ): Promise<SignTransactionResponse> {
    const rpcUrl = getRpcUrlByChainId(chain);
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain: ${chain}`);
    }

    const response = await this.enclaveApi.post(
      "/assets/send",
      {
        share,
        chain,
        to,
        amount,
        token,
        rpcUrl,
      },
      { headers: { Authorization: `Bearer ${clientApiKey}` } }
    );
    return response.data;
  }

  async getWalletAssets(
    clientId: string,
    chainId: string
  ): Promise<PortalAsset[]> {
    try {
      const response = await this.custodianApi.get(
        `/me/clients/${clientId}/chains/${encodeURIComponent(chainId)}/assets`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateWalletStatus(
    clientApiKey: string,
    params: UpdateWalletStatusParams
  ): Promise<void> {
    try {
      const response = await this.clientApi.patch(
        "/me/signing-share-pairs",
        params,
        {
          headers: { Authorization: `Bearer ${clientApiKey}` },
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to update wallet status");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to update wallet status: ${
            error.response?.data?.message || error.message
          }`
        );
      } else if (error instanceof Error) {
        throw new Error(`Failed to update wallet status: ${error.message}`);
      }
      throw new Error("Failed to update wallet status: Unknown error");
    }
  }

  async fundWallet(
    clientApiKey: string,
    chainId: string,
    token: string = "NATIVE",
    amount: string = "0.1"
  ): Promise<void> {
    try {
      const response = await this.clientApi.post(
        "/me/fund",
        {
          chainId,
          token,
          amount,
        },
        {
          headers: { Authorization: `Bearer ${clientApiKey}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fund wallet");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fund wallet: ${
            error.response?.data?.message || error.message
          }`
        );
      } else if (error instanceof Error) {
        throw new Error(`Failed to fund wallet: ${error.message}`);
      }
      throw new Error("Failed to fund wallet: Unknown error");
    }
  }
}
