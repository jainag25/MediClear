export default function QuickTerms({ terms, onSelect, accentColor }) {
  return (
    <div
      className="rounded-2xl border-2 bg-white p-4 shadow-lg"
      style={{ borderColor: "#6497b1" }}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#03396c]">
        Quick terms
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
        {terms.slice(0, 10).map((item) => (
          <button
            key={item.term}
            type="button"
            aria-label={`Use quick term ${item.term}`}
            onClick={() => onSelect(item.term)}
            className="whitespace-nowrap rounded-full border border-[#6497b1] bg-white px-3 py-1.5 text-sm text-[#011f4b] transition-all duration-300"
            onMouseEnter={(event) => {
              event.currentTarget.style.background = accentColor;
              event.currentTarget.style.borderColor = accentColor;
              event.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "#FFFFFF";
              event.currentTarget.style.borderColor = "#6497b1";
              event.currentTarget.style.color = "#011f4b";
            }}
          >
            {item.term}
          </button>
        ))}
      </div>
    </div>
  );
}
