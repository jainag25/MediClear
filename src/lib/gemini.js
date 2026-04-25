import { AUDIENCES } from "../constants/audiences";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const PREFERRED_MODEL_HINTS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
];

const REQUIRED_FIELDS = [
  "simpleTerm",
  "explanation",
  "analogy",
  "whatItMeans",
  "reassurance",
  "diagramType",
  "severity",
];

function extractJSONObject(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] ?? text;

  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("No JSON object found in Gemini response.");
  }
  return candidate.slice(first, last + 1);
}

function normalizeTranslation(data, term) {
  const fallback = {
    simpleTerm: term,
    explanation: "We could not fully parse this translation yet.",
    analogy: "Think of this as a medical concept your care team can walk you through step by step.",
    whatItMeans: "Ask your oncologist how this applies specifically to your case and treatment plan.",
    reassurance: "You do not need to navigate this alone - your care team can explain each step.",
    diagramType: "generic",
    severity: "informational",
  };

  const normalized = { ...fallback, ...(data || {}) };
  for (const field of REQUIRED_FIELDS) {
    if (!normalized[field]) normalized[field] = fallback[field];
  }

  return normalized;
}

async function listGenerateContentModels() {
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(listUrl);
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const apiMsg =
      payload?.error?.message ||
      `${res.status} ${res.statusText}` ||
      "Failed to list models";
    throw new Error(`ListModels failed: ${apiMsg}`);
  }

  const models = (payload?.models || [])
    .filter((m) => Array.isArray(m.supportedGenerationMethods))
    .filter((m) => m.supportedGenerationMethods.includes("generateContent"))
    .map((m) => (m.name || "").replace(/^models\//, ""))
    .filter(Boolean);

  const preferred = [];
  for (const hint of PREFERRED_MODEL_HINTS) {
    const match = models.find((m) => m.includes(hint));
    if (match && !preferred.includes(match)) preferred.push(match);
  }

  const rest = models.filter((m) => !preferred.includes(m));
  return [...preferred, ...rest];
}

export async function translateMedicalTerm(term, audience = "adult") {
  const cfg = AUDIENCES[audience] ?? AUDIENCES.adult;
  if (!apiKey) {
    return { ok: false, error: "Missing VITE_GEMINI_API_KEY in .env." };
  }

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
    let lastError = null;
    const attemptErrors = [];
    const modelCandidates = await listGenerateContentModels();

    if (modelCandidates.length === 0) {
      throw new Error("No models available for generateContent on this API key.");
    }

    for (const modelName of modelCandidates) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          }),
        });

        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          const apiMsg =
            payload?.error?.message ||
            `${res.status} ${res.statusText}` ||
            "Unknown Gemini API error";
          throw new Error(`[${modelName}] ${apiMsg}`);
        }

        const text =
          payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (!text) {
          throw new Error(`[${modelName}] Empty response from Gemini.`);
        }

        const objectText = extractJSONObject(text);
        const parsed = JSON.parse(objectText);
        return { ok: true, data: normalizeTranslation(parsed, term) };
      } catch (innerError) {
        lastError = innerError;
        attemptErrors.push(innerError?.message || String(innerError));
      }
    }

    const errorSummary = attemptErrors.slice(0, 4).join(" | ");
    throw (
      lastError ||
      new Error(
        `All Gemini model attempts failed.${errorSummary ? ` ${errorSummary}` : ""}`,
      )
    );
  } catch (error) {
    console.error("Gemini translation failed:", error);
    return {
      ok: false,
      error:
        error?.message ||
        "Gemini request failed. Verify API key, enabled API, and billing/quota.",
    };
  }
}
