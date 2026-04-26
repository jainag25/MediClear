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
      className="animate-fade-up space-y-4 rounded-2xl border-2 bg-white p-5 shadow-xl"
      style={{ borderColor: "#005b96" }}
    >
      <header>
        <h2 className="text-2xl font-black text-[#011f4b]">{result.simpleTerm}</h2>
        <p className="text-sm italic text-[#03396c]">From: {term}</p>
      </header>

      <section
        className={`rounded-xl border-l-4 p-4 ${audience.fontFamily}`}
        style={{
          borderLeftColor: "#005b96",
          background: "linear-gradient(to right, #b3cde0, #dcebf5)",
        }}
      >
        <h3 className="mb-1 text-sm font-bold text-[#011f4b]">Explanation</h3>
        <p className="text-[#011f4b]">{result.explanation}</p>
      </section>

      <section
        className="rounded-xl border-l-4 bg-[#eaf3fa] p-4"
        style={{ borderLeftColor: "#03396c" }}
      >
        <h3 className="mb-1 text-sm font-bold text-[#011f4b]">Analogy</h3>
        <p className="text-[#011f4b]">{result.analogy}</p>
      </section>

      <section className="rounded-xl bg-[#dcebf5] p-4 text-[#011f4b]">
        <h3 className="mb-1 text-sm font-bold">What it means for you</h3>
        <p>{result.whatItMeans}</p>
      </section>

      <section className="rounded-xl bg-[#f1f8fd] p-4 text-[#03396c]">
        <h3 className="mb-1 text-sm font-bold">Reassurance</h3>
        <p>{result.reassurance}</p>
      </section>

      <section className="flex flex-wrap items-center gap-2">
        <VoiceButton text={speechText} audienceConfig={audience} accentColor="#005b96" />
        <button
          type="button"
          aria-label="Save translation to glossary"
          onClick={onSave}
          disabled={isSaved}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:cursor-default"
          style={{
            borderColor: "#005b96",
            color: isSaved ? "#FFFFFF" : "#005b96",
            background: isSaved ? "#005b96" : "#FFFFFF",
          }}
        >
          {isSaved ? "Saved" : "Save to Glossary"}
        </button>
      </section>
    </div>
  );
}
