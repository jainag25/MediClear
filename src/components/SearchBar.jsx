export default function SearchBar({
  value,
  onChange,
  onTranslate,
  loading,
  accentColor,
  fontSize = "text-base",
}) {
  const disabled = loading || !value.trim();

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onTranslate();
    }
  };

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col gap-3 md:flex-row">
        <textarea
          aria-label="Medical term input"
          rows={2}
          className={`w-full resize-none rounded-xl border border-gray-200 px-4 py-3 ${fontSize} outline-none transition-all duration-300 focus:ring-2`}
          style={{ "--tw-ring-color": `${accentColor}55` }}
          placeholder="Type a cancer term (example: metastasis, PET scan, biopsy)..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          aria-label="Translate medical term"
          disabled={disabled}
          onClick={() => onTranslate()}
          className="rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-36"
          style={{ background: accentColor }}
        >
          Translate -&gt;
        </button>
      </div>
    </div>
  );
}
