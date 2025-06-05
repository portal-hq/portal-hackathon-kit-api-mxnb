import type { NextApiRequest, NextApiResponse } from "next";
import { PortalClient } from "@/lib/portal";

const portalClient = new PortalClient({
  custodianApiKey: process.env.PORTAL_CUSTODIAN_API_KEY!,
});

interface FundResponse {
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FundResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { clientId, chainId } = req.body;

  if (!clientId || typeof clientId !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Client ID is required" });
  }

  if (!chainId || typeof chainId !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Chain ID is required" });
  }

  // Create a client session token
  const sessionToken = await portalClient.createClientSessionToken(clientId);

  try {
    await portalClient.fundWallet(sessionToken.clientSessionToken, chainId, 'MXNB', '1');
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fund wallet",
    });
  }
}
