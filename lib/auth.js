import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "ideavault";

let client;

if (uri) {
  const globalForMongo = globalThis;
  globalForMongo._ideaVaultMongoClient ||= new MongoClient(uri);
  client = globalForMongo._ideaVaultMongoClient;
}

export const auth = betterAuth({
  database: uri ? mongodbAdapter(client.db(dbName)) : undefined,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
