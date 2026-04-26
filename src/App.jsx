import { useState } from "react";
import AudioInput from "./components/AudioInput";
import GlossaryPanel from "./components/GlossaryPanel";
import Header from "./components/Header";
import QuickTerms from "./components/QuickTerms";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import TranslationCard from "./components/TranslationCard";
import { ONCOLOGY_TERMS } from "./data/oncologyTerms";
import { useAudience } from "./hooks/useAudience";
import { useGlossary } from "./hooks/useGlossary";
import { speakText } from "./lib/elevenlabs";
import { translateMedicalTerm } from "./lib/gemini";

export default function App() {
  const { audienceKey, audience, setAudience, AUDIENCES } = useAudience();
  const { glossary, saveEntry, removeEntry, clearAll, isSaved } = useGlossary();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [currentTerm, setCurrentTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("text-text");
  const [capturedAudioText, setCapturedAudioText] = useState("");

  const geminiReady = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  const handleTranslate = async (termOverride, options = {}) => {
    const term = (termOverride ?? input).trim();
    if (!term || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setCurrentTerm(term);
    if (!termOverride) setInput(term);

    try {
      const response = await translateMedicalTerm(term, audienceKey);
      if (response?.ok) {
        setResult(response.data);
        const shouldSpeak =
          options.autoSpeak || mode === "text-audio" || mode === "audio-audio";
        if (shouldSpeak) {
          const speechText = [
            response.data?.simpleTerm,
            response.data?.explanation,
            response.data?.analogy,
            response.data?.whatItMeans,
            response.data?.reassurance,
          ]
            .filter(Boolean)
            .join(". ");
          if (speechText) {
            await speakText(speechText, audience);
          }
        }
      } else if (!geminiReady) {
        setError("Missing Gemini API key. Add VITE_GEMINI_API_KEY in .env.");
      } else {
        setError(
          response?.error ||
            "Translation failed. Please check your API key and try again.",
        );
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
        background: "linear-gradient(to bottom right, #b3cde0, #6497b1)",
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
        <div className="mx-auto mt-4 max-w-5xl rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Add <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to enable live
          translations.
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1
            className="mb-3 text-4xl font-black leading-tight sm:text-5xl"
            style={{
              background: "linear-gradient(to right, #011f4b, #005b96)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MediClear
          </h1>
          <p className="mx-auto max-w-2xl text-lg" style={{ color: "#011f4b" }}>
            Translate medical terminology your way: text to text, text to
            speech, or speech to speech.
          </p>
        </div>

        <section
          className="mb-6 rounded-2xl border-2 bg-white p-5 shadow-lg"
          style={{ borderColor: "#6497b1" }}
        >
          <h2 className="mb-3 text-lg font-bold" style={{ color: "#011f4b" }}>
            Who are we explaining this for?
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {Object.values(AUDIENCES).map((item) => (
              <button
                key={item.key}
                type="button"
                aria-label={`Switch audience to ${item.label}`}
                onClick={() => setAudience(item.key)}
                className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300"
                style={{
                  borderColor: audienceKey === item.key ? "#005b96" : "#6497b1",
                  background: audienceKey === item.key ? "#005b96" : "#ffffff",
                  color: audienceKey === item.key ? "#ffffff" : "#011f4b",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section
          className="mb-6 rounded-2xl border-2 bg-white p-5 shadow-lg"
          style={{ borderColor: "#6497b1" }}
        >
          <h2 className="mb-3 text-lg font-bold" style={{ color: "#011f4b" }}>
            Translation mode
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { key: "text-text", label: "Text to Text" },
              { key: "text-audio", label: "Text to Audio" },
              { key: "audio-audio", label: "Audio to Audio" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                aria-label={`Switch mode to ${item.label}`}
                onClick={() => setMode(item.key)}
                className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300"
                style={{
                  borderColor: mode === item.key ? "#03396c" : "#6497b1",
                  background: mode === item.key ? "#03396c" : "#ffffff",
                  color: mode === item.key ? "#ffffff" : "#011f4b",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section
          className="mb-4 rounded-2xl border-2 bg-white p-5 shadow-lg"
          style={{ borderColor: "#6497b1" }}
        >
          <h2 className="mb-3 text-lg font-bold" style={{ color: "#011f4b" }}>
            Enter medical term
          </h2>
          <p className="mb-4 text-sm" style={{ color: "#03396c" }}>
            Type or record a cancer-related term you want explained.
          </p>
          {mode !== "audio-audio" ? (
            <SearchBar
              value={input}
              onChange={setInput}
              onTranslate={handleTranslate}
              loading={loading}
              accentColor="#005b96"
              fontSize={audience.fontSize}
            />
          ) : (
            <AudioInput
              onTranscript={setCapturedAudioText}
              onSubmitTranscript={(text) => {
                setInput(text);
                handleTranslate(text, { autoSpeak: true });
              }}
              loading={loading}
              accentColor="#005b96"
            />
          )}
        </section>

        <div className="mb-6">
          <QuickTerms
            terms={ONCOLOGY_TERMS}
            onSelect={(term) => handleTranslate(term)}
            accentColor="#005b96"
          />
        </div>

        <div
          className={`mt-8 grid gap-6 ${
            result || loading || glossary.length > 0
              ? "grid-cols-1 md:grid-cols-[1fr_280px]"
              : "grid-cols-1"
          }`}
        >
          <div>
            {loading && <Spinner accentColor="#005b96" />}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
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
              <div
                className="rounded-2xl border-2 border-dashed bg-white p-12 text-center"
                style={{ borderColor: "#6497b1" }}
              >
                <p style={{ color: "#03396c" }}>
                  {mode === "audio-audio"
                    ? "Record audio above or click a quick term to start."
                    : "Enter a term above or click a quick term to start."}
                </p>
                {mode === "audio-audio" && capturedAudioText && (
                  <p className="mt-2 text-xs" style={{ color: "#005b96" }}>
                    Last transcript: {capturedAudioText}
                  </p>
                )}
              </div>
            )}
          </div>

          {(result || loading || glossary.length > 0) && (
            <GlossaryPanel
              glossary={glossary}
              onSelect={handleTranslate}
              onRemove={removeEntry}
              onClear={clearAll}
              accentColor="#005b96"
            />
          )}
        </div>

        <footer
          className="mt-16 border-t pt-6 text-center text-xs"
          style={{ borderColor: "#6497b1", color: "#011f4b" }}
        >
          MediClear is an educational tool. Always consult your healthcare
          provider.
          <br />
          Built at LAHacks 2026 - Catalyst for Care - Light the Way
        </footer>
      </main>
    </div>
  );
}
