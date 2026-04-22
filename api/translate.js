import { GoogleGenerativeAI } from "@google/generative-ai";

const audienceGuide = {
  kids:
    "Explain like you're talking to a curious 10-year-old. Use fun analogies and short sentences.",
  adult:
    "Use clear, plain English for an adult with no medical background. No jargon.",
  elderly:
    "Use simple, warm, and reassuring language for an older adult. Short sentences and patient tone.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { term, audience = "adult" } = req.body || {};
    if (!term) return res.status(400).json({ error: "term is required" });

    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const prompt = `You are a compassionate medical translator helping oncology (cancer) patients understand their diagnosis.

Medical term or phrase: "${term}"

Audience: ${audienceGuide[audience] ?? audienceGuide.adult}

Respond ONLY with valid JSON. No markdown, no backticks, no extra text. Exactly this shape:
{
  "simpleTerm": "plain 1-6 word name",
  "explanation": "2-3 sentence plain-language explanation",
  "analogy": "one concrete analogy that makes this click",
  "whatItMeans": "1-2 sentences on what this means practically for the patient",
  "reassurance": "one warm sentence of reassurance or a suggested next step",
  "diagramType": "one of: cell | spread | treatment | scan | blood | device | generic",
  "severity": "one of: informational | moderate | serious"
}`;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return res.status(200).json(JSON.parse(clean));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Translation failed" });
  }
}
