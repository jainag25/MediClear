import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  term: String,
  result: Object,
  audience: String,
  savedAt: { type: Date, default: Date.now },
});

const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    return res.status(500).json({ error: "Missing MONGODB_URI" });
  }

  try {
    await connectDB();

    if (req.method === "GET") {
      const sessionId = req.query.sessionId;
      if (!sessionId) return res.status(400).json({ error: "sessionId required" });
      const entries = await Entry.find({ sessionId }).sort({ savedAt: -1 }).lean();
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const { sessionId, term, result, audience = "adult" } = req.body || {};
      if (!sessionId || !term || !result) {
        return res
          .status(400)
          .json({ error: "sessionId, term, and result are required" });
      }

      const entry = await Entry.findOneAndUpdate(
        { sessionId, term },
        { sessionId, term, result, audience, savedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).lean();

      return res.status(200).json(entry);
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Glossary request failed" });
  }
}
