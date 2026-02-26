/**
 * MongoDB connection singleton.
 * Multi-tenant: uses CLIENT_ID env var to determine database name.
 * Adapted from AEO donor codebase (lib/rag/mongodb.ts).
 */

import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  client = new MongoClient(uri, {
    maxPoolSize: 3,
    waitQueueTimeoutMS: 5000,
  });
  await client.connect();
  return client;
}

/**
 * Get the database for the current tenant.
 * Database name defaults to "tsc" — the TSC collection in MongoDB Atlas.
 * For multi-tenant: each client could use the same DB with clientId field isolation,
 * or separate databases. Current approach: shared DB, clientId-scoped queries.
 */
export async function getDatabase(): Promise<Db> {
  if (db) return db;

  const mongoClient = await getMongoClient();
  db = mongoClient.db('tsc');
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
