import { MongoClient } from "mongodb";

export async function GET() {
  const checks = {
    hasApiUrl: Boolean(process.env.NEXT_PUBLIC_API_URL),
    hasBetterAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    betterAuthUrl: process.env.BETTER_AUTH_URL || null,
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    dbName: process.env.DB_NAME || null,
    hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    mongoPing: "not_checked",
  };

  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.db(process.env.DB_NAME || "ideavault").command({ ping: 1 });
      checks.mongoPing = "ok";
    } catch (error) {
      checks.mongoPing = error.message;
    } finally {
      await client.close();
    }
  }

  return Response.json(checks);
}
