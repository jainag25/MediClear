import { ElevenLabsClient } from "elevenlabs";

const VOICE_IDS = {
  kids: "pNInz6obpgDQGcFmaJgB",
  adult: "EXAVITQu4vr4xnSDxMaL",
  elderly: "ThT5KcBeYPX3keUQqHPh",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { text, audience = "adult" } = req.body || {};
    if (!text) return res.status(400).json({ error: "text is required" });
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: "Missing ELEVENLABS_API_KEY" });
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const stream = await client.textToSpeech.convert(
      VOICE_IDS[audience] ?? VOICE_IDS.adult,
      {
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.85,
        },
      },
    );

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(Buffer.concat(chunks));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "TTS failed" });
  }
}
