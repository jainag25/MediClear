import { GoogleGenerativeAI } from "@google/generative-ai";
import { AUDIENCES } from "../constants/audiences";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function translateMedicalTerm(term, audience = "adult") {
  const cfg = AUDIENCES[audience] ?? AUDIENCES.adult;
  if (!genAI) return null;

  const prompt = `You are a compassionate medical translator helping oncology (cancer) patients understand their diagnosis.

Medical term or phrase: "${term}"

Audience: ${cfg.promptGuidance}

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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini translation failed:", error);
    return null;
  }
}
