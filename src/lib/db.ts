import { db } from "./init-db";

// Define our database schema
interface Schema {
  signingShares: {
    id: string;
    clientId: string;
    curve: "SECP256K1" | "ED25519";
    share: string;
    createdAt: string;
  }[];
}

// Initialize the database with default data
export async function initializeDB() {
  await db.read();
  await db.write();
}

// Signing share operations
export async function saveSigningShare(data: {
  clientId: string;
  curve: "SECP256K1" | "ED25519";
  share: string;
}) {
  await db.read();
  const signingShare = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  db.data.signingShares.push(signingShare);
  await db.write();
  return signingShare;
}

export async function getClientSigningShares(clientId: string) {
  await db.read();
  return db.data.signingShares.filter((share) => share.clientId === clientId);
}

export async function getSigningShare(id: string) {
  await db.read();
  return db.data.signingShares.find((share) => share.id === id);
}

// Helper function to read all data (for debugging)
export async function readAllData() {
  await db.read();
  return db.data;
}

// Initialize the database when the module is imported
initializeDB().catch(console.error);
