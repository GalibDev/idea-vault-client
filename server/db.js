import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "ideavault";

if (!uri) {
  throw new Error("MONGODB_URI is missing from server/.env");
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (db) {
    return db;
  }

  await client.connect();
  db = client.db(dbName);
  await db.collection("ideas").createIndex({ title: "text", category: 1, authorEmail: 1 });
  await db.collection("comments").createIndex({ ideaId: 1, userEmail: 1 });
  return db;
}

export function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}
