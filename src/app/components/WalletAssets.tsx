"use client";

import { useState, useEffect } from "react";
import type { WalletAssets } from "@/types/api";
import { CHAINS } from "@/types/api";

// Helper function to determine curve type based on chain
function getCurveForChain(chainId: string): "SECP256K1" | "ED25519" {
  const ed25519Chains = [
    "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", // Solana Mainnet
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1", // Solana Devnet
    "stellar:pubnet", // Stellar Mainnet
    "stellar:testnet", // Stellar Testnet
  ];

  return ed25519Chains.includes(chainId) ? "ED25519" : "SECP256K1";
}

interface WalletAssetsProps {
  walletId: string;
  chainId?: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (to: string, amount: string) => Promise<void>;
  assetName: string;
  assetSymbol: string;
  balance: string;
  decimals: number;
}

function TransferModal({
  isOpen,
  onClose,
  onTransfer,
  assetName,
  assetSymbol,
  balance,
  decimals,
}: TransferModalProps) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onTransfer(to, amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Transfer {assetName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700"
              placeholder="0x..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700"
              placeholder="0.0"
              step="any"
              min="0"
              max={Number(balance)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Balance: {Number(balance).toFixed(4)} {assetSymbol}
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Transferring..." : "Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WalletAssets({
  walletId,
  chainId: initialChainId,
}: WalletAssetsProps) {
  const [assets, setAssets] = useState<WalletAssets | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>(
    initialChainId ||
      CHAINS.find((c) => c.id === "ethereum")?.chainId ||
      CHAINS[0].chainId
  );
  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    assetName: string;
    assetSymbol: string;
    balance: string;
    decimals: number;
    tokenAddress?: string;
  } | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/wallets/${walletId}/assets?chainId=${selectedChain}`
      );
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
      } else {
        setError(data.error || "Failed to fetch assets");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch assets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [walletId, selectedChain]);

  const formatBalance = (balance: string, decimals: number) => {
    return (Number(balance) / Math.pow(10, decimals)).toFixed(4);
  };

  const handleTransfer = async (to: string, amount: string) => {
    if (!transferModal) return;

    const curve = getCurveForChain(selectedChain);

    const response = await fetch("/api/wallets/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: walletId,
        curve,
        chain: selectedChain,
        to,
        amount: amount,
        token: transferModal.tokenAddress || "native",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Transfer failed");
    }

    // Refresh assets after successful transfer
    await fetchAssets();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading assets...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
        <button
          onClick={fetchAssets}
          className="ml-2 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!assets) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="px-3 py-2 border rounded bg-white dark:bg-gray-800"
        >
          {[...CHAINS]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((chain) => (
              <option key={chain.id} value={chain.chainId}>
                {chain.name}
              </option>
            ))}
        </select>
        <button
          onClick={fetchAssets}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Assets
        </button>
      </div>

      {/* Native Balance */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Native Balance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono">
              {Number(assets.nativeBalance.balance).toFixed(4)}
            </span>
            <span className="text-gray-600">{assets.nativeBalance.symbol}</span>
          </div>
          <button
            onClick={() =>
              setTransferModal({
                isOpen: true,
                assetName: "Native Token",
                assetSymbol: assets.nativeBalance.symbol,
                balance: assets.nativeBalance.balance,
                decimals: assets.nativeBalance.decimals,
              })
            }
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Transfer
          </button>
        </div>
      </div>

      {/* Token Balances */}
      {assets.tokenBalances.length > 0 && (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Token Balances</h3>
          <div className="space-y-2">
            {assets.tokenBalances.map((token) => (
              <div
                key={token.metadata.tokenAddress}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{token.name}</span>
                  <span className="text-gray-600 ml-2">({token.symbol})</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono">
                    {Number(token.balance).toFixed(4)}
                  </span>
                  <button
                    onClick={() =>
                      setTransferModal({
                        isOpen: true,
                        assetName: token.name,
                        assetSymbol: token.symbol,
                        balance: token.balance,
                        decimals: token.decimals,
                        tokenAddress: token.metadata.tokenAddress,
                      })
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFTs */}
      {assets.nfts && assets.nfts.length > 0 && (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">NFTs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.nfts.map((nft) => (
              <div key={nft.nftId} className="border rounded overflow-hidden">
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium truncate">{nft.name}</h4>
                  <p className="text-sm text-gray-600 truncate">
                    {nft.collection.name}
                  </p>
                  {nft.floorPrice && (
                    <p className="text-sm mt-1">
                      Floor: {nft.floorPrice.price} {nft.floorPrice.currency}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transferModal && (
        <TransferModal
          isOpen={transferModal.isOpen}
          onClose={() => setTransferModal(null)}
          onTransfer={handleTransfer}
          assetName={transferModal.assetName}
          assetSymbol={transferModal.assetSymbol}
          balance={transferModal.balance}
          decimals={transferModal.decimals}
        />
      )}
    </div>
  );
}
