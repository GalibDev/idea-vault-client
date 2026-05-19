import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { connectDB, toObjectId } from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || "ideavault-development-secret";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

app.get("/", async (req, res) => {
  await connectDB();
  res.json({ message: "IdeaVault API is running with MongoDB." });
});

app.post("/jwt", (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const token = jwt.sign({ email, name }, jwtSecret, { expiresIn: "7d" });
  return res.json({ token });
});

app.get("/ideas", async (req, res) => {
  const db = await connectDB();
  const search = req.query.search || "";
  const category = req.query.category || "";
  const limit = Number(req.query.limit) || 0;

  const query = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  if (category && category !== "All Categories") {
    query.category = category;
  }

  let cursor = db.collection("ideas").find(query).sort({ createdAt: -1 });
  if (limit > 0) {
    cursor = cursor.limit(limit);
  }

  const ideas = await cursor.toArray();
  res.json(ideas);
});

app.get("/ideas/:id", async (req, res) => {
  const db = await connectDB();
  const objectId = toObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).json({ message: "Invalid idea id." });
  }

  const idea = await db.collection("ideas").findOne({ _id: objectId });
  if (!idea) {
    return res.status(404).json({ message: "Idea not found." });
  }

  return res.json(idea);
});

app.get("/my-ideas", verifyToken, async (req, res) => {
  const db = await connectDB();
  const ideas = await db.collection("ideas").find({ authorEmail: req.user.email }).sort({ createdAt: -1 }).toArray();
  res.json(ideas);
});

app.post("/ideas", verifyToken, async (req, res) => {
  const db = await connectDB();
  const idea = {
    ...req.body,
    authorEmail: req.user.email,
    authorName: req.user.name || req.user.email,
    likes: 0,
    comments: 0,
    createdAt: new Date(),
  };

  const result = await db.collection("ideas").insertOne(idea);
  res.status(201).json({ ...idea, _id: result.insertedId });
});

app.patch("/ideas/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const objectId = toObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).json({ message: "Invalid idea id." });
  }

  const result = await db.collection("ideas").updateOne(
    { _id: objectId, authorEmail: req.user.email },
    { $set: { ...req.body, updatedAt: new Date() } }
  );

  res.json({ message: "Idea updated successfully.", modifiedCount: result.modifiedCount });
});

app.delete("/ideas/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const objectId = toObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).json({ message: "Invalid idea id." });
  }

  const result = await db.collection("ideas").deleteOne({ _id: objectId, authorEmail: req.user.email });
  await db.collection("comments").deleteMany({ ideaId: req.params.id });
  res.json({ message: "Idea deleted successfully.", deletedCount: result.deletedCount });
});

app.get("/comments/:ideaId", verifyToken, async (req, res) => {
  const db = await connectDB();
  const comments = await db.collection("comments").find({ ideaId: req.params.ideaId }).sort({ createdAt: -1 }).toArray();
  res.json(comments);
});

app.post("/comments/:ideaId", verifyToken, async (req, res) => {
  const db = await connectDB();
  if (!req.body.text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  const comment = {
    ideaId: req.params.ideaId,
    userEmail: req.user.email,
    userName: req.user.name || req.user.email,
    text: req.body.text,
    createdAt: new Date(),
  };

  const result = await db.collection("comments").insertOne(comment);
  await db.collection("ideas").updateOne({ _id: toObjectId(req.params.ideaId) }, { $inc: { comments: 1 } });
  res.status(201).json({ ...comment, _id: result.insertedId });
});

app.patch("/comments/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const objectId = toObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).json({ message: "Invalid comment id." });
  }

  const result = await db.collection("comments").updateOne(
    { _id: objectId, userEmail: req.user.email },
    { $set: { text: req.body.text, updatedAt: new Date() } }
  );

  res.json({ message: "Comment updated successfully.", modifiedCount: result.modifiedCount });
});

app.delete("/comments/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const objectId = toObjectId(req.params.id);
  if (!objectId) {
    return res.status(400).json({ message: "Invalid comment id." });
  }

  const result = await db.collection("comments").deleteOne({ _id: objectId, userEmail: req.user.email });
  res.json({ message: "Comment deleted successfully.", deletedCount: result.deletedCount });
});

app.listen(port, () => {
  console.log(`IdeaVault API running on port ${port}`);
});
