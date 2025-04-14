// this files manages the rest endpoints to create, get, update and delete wallets
import { saveSigningShare } from "@/lib/db";
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

type WalletResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletResponse>
) {
  switch (req.method) {
    case "POST":
      return handleCreate(req, res);
    case "GET":
      return handleList(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

async function handleCreate(
  req: NextApiRequest,
  res: NextApiResponse<WalletResponse>
) {
  try {
    // create client and wallet on portal and get client metadata
    const client = await portalClient.createClient();
    const portalWallet = await portalClient.createWallet(client.clientApiKey);
    await portalClient.updateWalletStatus(client.clientApiKey, {
      status: "STORED_CLIENT",
      signingSharePairIds: [portalWallet.ED25519.id, portalWallet.SECP256K1.id],
    });
    const clientMe = await portalClient.getClient(client.id);

    // store client and wallet info in the db
    await saveSigningShare({
      clientId: client.id,
      curve: "ED25519",
      share: portalWallet.ED25519.share,
    });
    await saveSigningShare({
      clientId: client.id,
      curve: "SECP256K1",
      share: portalWallet.SECP256K1.share,
    });

    return res.status(201).json({ success: true, data: clientMe });
  } catch (error) {
    let errorMessage = "Failed to create wallet";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(400).json({ success: false, error: errorMessage });
  }
}

async function handleList(
  req: NextApiRequest,
  res: NextApiResponse<WalletResponse>
) {
  try {
    const clients = await portalClient.getClients();

    return res.status(200).json({ success: true, data: clients });
  } catch (error) {
    console.error("List wallets error:", error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get wallets",
    });
  }
}
