"use client";

import { useState, useEffect } from "react";
import type { Wallet } from "@/types/api";
import WalletAssets from "./WalletAssets";
import { CHAIN_CONFIGS } from "@/lib/chains";

export default function WalletList() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [funding, setFunding] = useState(false);
  const [expandedWalletId, setExpandedWalletId] = useState<string | null>(null);
  const [selectedChain] = useState<string>(CHAIN_CONFIGS[1].chainId);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/wallets");
      const data = await response.json();
      if (data.success) {
        // Sort wallets by creation date, most recent first
        const sortedWallets = data.data.results.sort(
          (a: Wallet, b: Wallet) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWallets(sortedWallets);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load wallets on component mount
  useEffect(() => {
    fetchWallets();
  }, []);

  const createWallet = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        // Refresh the wallet list after successful creation
        await fetchWallets();
      } else {
        console.error("Failed to create wallet:", data.error);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleFund = async (walletId: string) => {
    setFunding(true);
    try {
      const response = await fetch("/api/wallets/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: walletId,
          chainId: selectedChain,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fund wallet");
      }

      // Refresh the wallet list after successful funding
      await fetchWallets();
    } catch (error) {
      console.error("Error funding wallet:", error);
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={createWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create New Wallet"}
        </button>
        <button
          onClick={fetchWallets}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Wallets"}
        </button>
      </div>
      <div className="mt-4">
        {wallets?.length > 0 ? (
          <ul className="space-y-4">
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className="p-4 border rounded hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono">ID: {wallet.id}</p>
                      <p className="font-mono">
                        Created: {new Date(wallet.createdAt).toLocaleString()}
                      </p>
                      <p className="font-mono">
                        Account Abstracted:{" "}
                        {wallet.isAccountAbstracted ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFund(wallet.id)}
                        disabled={funding}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        {funding ? "Funding..." : "Fund MXNB"}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedWalletId(
                            expandedWalletId === wallet.id ? null : wallet.id
                          )
                        }
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        {expandedWalletId === wallet.id
                          ? "Hide Assets"
                          : "Show Assets"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    {wallet.metadata.namespaces.eip155 && (
                      <p className="font-mono text-sm">
                        Address:{" "}
                        {wallet.metadata.namespaces.eip155.address}
                      </p>
                    )}
                  </div>

                  {expandedWalletId === wallet.id && (
                    <div className="mt-4 pt-4 border-t">
                      <WalletAssets walletId={wallet.id} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No wallets found</p>
        )}
      </div>
    </div>
  );
}
