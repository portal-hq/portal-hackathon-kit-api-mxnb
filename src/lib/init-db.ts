import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import fs from "fs";

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

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const file = path.join(dataDir, "db.json");
const adapter = new JSONFile<Schema>(file);
const database = new Low<Schema>(adapter, {
  signingShares: [],
});

// Initialize the database with default data
export async function initializeDB() {
  await database.read();
  if (!database.data) {
    database.data = { signingShares: [] };
    await database.write();
  }
  return database;
}

// Export the initialized database
export const db = await initializeDB();
