import { NextApiRequest, NextApiResponse } from "next";
import { PortalClient } from "@/lib/portal";
import { getClientSigningShares } from "@/lib/db";
import { AxiosError } from "axios";

const portalClient = new PortalClient({
  custodianApiKey: process.env.PORTAL_CUSTODIAN_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { clientId, curve, chain, to, amount, token } = req.body;

    // Validate required fields
    if (!clientId || !curve || !chain || !to || !amount || !token) {
      return res.status(400).json({
        error:
          "Missing required fields: clientId, curve, chain, to, amount, token",
      });
    }

    // Validate curve type
    if (curve !== "SECP256K1" && curve !== "ED25519") {
      return res.status(400).json({
        error: "Invalid curve type. Must be either 'SECP256K1' or 'ED25519'",
      });
    }

    // Get the signing share from the database
    const signingShares = await getClientSigningShares(clientId);
    const share = signingShares.find((s) => s.curve === curve);

    if (!share) {
      return res.status(400).json({
        error: `Wallet's ${curve} MPC share not found in database. Please create a wallet first.`,
      });
    }

    // Create a client session token
    const sessionToken = await portalClient.createClientSessionToken(clientId);

    // Use the session token to transfer assets
    const result = await portalClient.transferAssets(
      sessionToken.clientSessionToken,
      share.share,
      chain,
      to,
      amount,
      token
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error transferring assets:", error);
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      return res.status(500).json({ error: error.response?.data.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
}
