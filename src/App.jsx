import { useState } from "react";
import GlossaryPanel from "./components/GlossaryPanel";
import Header from "./components/Header";
import QuickTerms from "./components/QuickTerms";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import TranslationCard from "./components/TranslationCard";
import { ONCOLOGY_TERMS } from "./data/oncologyTerms";
import { useAudience } from "./hooks/useAudience";
import { useGlossary } from "./hooks/useGlossary";
import { translateMedicalTerm } from "./lib/gemini";

export default function App() {
  const { audienceKey, audience, setAudience, AUDIENCES } = useAudience();
  const { glossary, saveEntry, removeEntry, clearAll, isSaved } = useGlossary();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [currentTerm, setCurrentTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const geminiReady = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  const handleTranslate = async (termOverride) => {
    const term = (termOverride ?? input).trim();
    if (!term || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setCurrentTerm(term);
    if (!termOverride) setInput(term);

    try {
      const data = await translateMedicalTerm(term, audienceKey);
      if (data) {
        setResult(data);
      } else if (!geminiReady) {
        setError("Missing Gemini API key. Add VITE_GEMINI_API_KEY in .env.");
      } else {
        setError("Translation failed. Please check your API key and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: audience.bgColor,
        transition: "all 0.3s ease",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <Header
        audience={audience}
        AUDIENCES={AUDIENCES}
        onAudienceChange={setAudience}
      />

      {!geminiReady && (
        <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Add <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to enable live
          translations.
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
            What did your doctor say?
          </h1>
          <p className="mx-auto max-w-lg text-gray-500">
            Paste any cancer-related term or phrase. We will explain it in plain
            language with diagrams.
          </p>
        </div>

        <SearchBar
          value={input}
          onChange={setInput}
          onTranslate={handleTranslate}
          loading={loading}
          accentColor={audience.accentColor}
          fontSize={audience.fontSize}
        />

        <QuickTerms
          terms={ONCOLOGY_TERMS}
          onSelect={(term) => handleTranslate(term)}
          accentColor={audience.accentColor}
        />

        <div
          className={`mt-8 grid gap-6 ${
            result || loading || glossary.length > 0
              ? "grid-cols-1 md:grid-cols-[1fr_280px]"
              : "grid-cols-1"
          }`}
        >
          <div>
            {loading && <Spinner accentColor={audience.accentColor} />}
            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}
            {result && !loading && (
              <TranslationCard
                result={result}
                term={currentTerm}
                audience={audience}
                onSave={() => saveEntry(currentTerm, result)}
                isSaved={isSaved(currentTerm)}
              />
            )}
            {!result && !loading && !error && (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                <div className="mb-3 text-5xl">🔬</div>
                <p className="text-gray-400">
                  Enter a term above or click a quick term to start.
                </p>
              </div>
            )}
          </div>

          {(result || loading || glossary.length > 0) && (
            <GlossaryPanel
              glossary={glossary}
              onSelect={handleTranslate}
              onRemove={removeEntry}
              onClear={clearAll}
              accentColor={audience.accentColor}
            />
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.values(AUDIENCES).map((item) => (
            <button
              key={item.key}
              type="button"
              aria-label={`Switch audience to ${item.label}`}
              onClick={() => setAudience(item.key)}
              className="rounded-2xl bg-white p-5 text-left transition-all duration-300"
              style={{
                border: `2px solid ${
                  audienceKey === item.key ? item.accentColor : "#E5E7EB"
                }`,
                boxShadow:
                  audienceKey === item.key
                    ? `0 4px 20px ${item.accentColor}22`
                    : "none",
              }}
            >
              <div className="mb-2 text-3xl">{item.emoji}</div>
              <div className="mb-1 font-bold text-gray-900">{item.label} Mode</div>
              <div className="text-xs leading-relaxed text-gray-400">
                {item.description}
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-16 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          OncoClear is an educational tool. Always consult your healthcare
          provider.
          <br />
          Built at LAHacks 2026 · Catalyst for Care · Light the Way
        </footer>
      </main>
    </div>
  );
}
