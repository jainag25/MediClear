import VoiceButton from "./VoiceButton";

export default function TranslationCard({
  result,
  term,
  audience,
  onSave,
  isSaved,
}) {
  const speechText = [
    result?.simpleTerm,
    result?.explanation,
    result?.analogy,
    result?.whatItMeans,
    result?.reassurance,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div
      className="animate-fade-up space-y-4 rounded-2xl p-5 ring-1 ring-black/5"
      style={{ background: audience.cardColor }}
    >
      <header>
        <h2 className="text-2xl font-black text-gray-900">{result.simpleTerm}</h2>
        <p className="text-sm italic text-gray-500">From: {term}</p>
      </header>

      <section
        className={`rounded-xl border-l-4 bg-white p-4 ${audience.fontFamily}`}
        style={{ borderLeftColor: audience.accentColor }}
      >
        <h3 className="mb-1 text-sm font-bold text-gray-700">Explanation</h3>
        <p className="text-gray-700">{result.explanation}</p>
      </section>

      <section className="rounded-xl bg-white p-4">
        <h3 className="mb-1 text-sm font-bold text-gray-700">Analogy</h3>
        <p className="text-gray-700">{result.analogy}</p>
      </section>

      <section
        className="rounded-xl p-4 text-gray-800"
        style={{ background: `${audience.accentColor}20` }}
      >
        <h3 className="mb-1 text-sm font-bold">What it means for you</h3>
        <p>{result.whatItMeans}</p>
      </section>

      <section className="rounded-xl bg-green-50 p-4 text-green-800">
        <h3 className="mb-1 text-sm font-bold">Reassurance</h3>
        <p>🌱 {result.reassurance}</p>
      </section>

      <section className="flex flex-wrap items-center gap-2">
        <VoiceButton
          text={speechText}
          audienceConfig={audience}
          accentColor={audience.accentColor}
        />
        <button
          type="button"
          aria-label="Save translation to glossary"
          onClick={onSave}
          disabled={isSaved}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:cursor-default"
          style={{
            borderColor: isSaved ? "#16A34A" : audience.accentColor,
            color: isSaved ? "#FFFFFF" : audience.accentColor,
            background: isSaved ? "#16A34A" : "#FFFFFF",
          }}
        >
          {isSaved ? "✅ Saved!" : "💾 Save to Glossary"}
        </button>
      </section>
    </div>
  );
}
