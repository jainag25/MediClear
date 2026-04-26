export default function GlossaryPanel({
  glossary,
  onSelect,
  onRemove,
  onClear,
  accentColor,
}) {
  return (
    <aside
      className="h-fit rounded-2xl border-2 bg-white p-4 shadow-lg"
      style={{ borderColor: "#6497b1" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#011f4b]">Saved Glossary</h3>
        {glossary.length > 0 && (
          <button
            type="button"
            aria-label="Clear saved glossary"
            className="text-xs font-semibold text-[#03396c]"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>

      {glossary.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#b3cde0] p-4 text-center text-xs text-[#03396c]">
          No saved terms yet.
        </div>
      ) : (
        <div className="space-y-2">
          {glossary.map((entry) => (
            <div
              key={entry.term}
              className="rounded-xl border border-[#dcebf5] bg-[#f8fbff] p-3 transition-all duration-300"
              style={{ borderLeft: `4px solid ${accentColor}` }}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  aria-label={`View saved term ${entry.term}`}
                  className="min-w-0 text-left"
                  onClick={() => onSelect(entry.term)}
                >
                  <p className="truncate text-sm font-bold text-[#011f4b]">{entry.term}</p>
                  <p className="truncate text-xs text-[#03396c]">
                    {entry.result?.simpleTerm || "Saved translation"}
                  </p>
                </button>
                <button
                  type="button"
                  aria-label={`Remove saved term ${entry.term}`}
                  className="text-xs font-bold text-[#6497b1] hover:text-[#03396c]"
                  onClick={() => onRemove(entry.term)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
