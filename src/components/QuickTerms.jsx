export default function QuickTerms({ terms, onSelect, accentColor }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Quick terms
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
        {terms.slice(0, 10).map((item) => (
          <button
            key={item.term}
            type="button"
            aria-label={`Use quick term ${item.term}`}
            onClick={() => onSelect(item.term)}
            className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-all duration-300"
            onMouseEnter={(event) => {
              event.currentTarget.style.background = accentColor;
              event.currentTarget.style.borderColor = accentColor;
              event.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "#FFFFFF";
              event.currentTarget.style.borderColor = "#E5E7EB";
              event.currentTarget.style.color = "#374151";
            }}
          >
            {item.icon} {item.term}
          </button>
        ))}
      </div>
    </div>
  );
}
