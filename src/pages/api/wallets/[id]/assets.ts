import { PortalClient } from "@/lib/portal";
import type { NextApiRequest, NextApiResponse } from "next";

if (!process.env.PORTAL_CUSTODIAN_API_KEY) {
  throw new Error(
    "PORTAL_CUSTODIAN_API_KEY is not set in environment variables"
  );
}

const portalClient = new PortalClient({
  custodianApiKey: process.env.PORTAL_CUSTODIAN_API_KEY,
});

type AssetsResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssetsResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { id } = req.query;
  const { chainId } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Wallet ID is required" });
  }

  if (!chainId || typeof chainId !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Chain ID is required" });
  }

  try {
    const assets = await portalClient.getWalletAssets(id, chainId);
    return res.status(200).json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching wallet assets:", error);
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get wallet assets",
    });
  }
}
