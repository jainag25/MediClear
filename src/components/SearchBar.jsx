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
    <div className="rounded-2xl bg-[#f7fbff] p-3 ring-1 ring-[#b3cde0]">
      <div className="flex flex-col gap-3 md:flex-row">
        <textarea
          aria-label="Medical term input"
          rows={2}
          className={`w-full resize-none rounded-xl border border-[#6497b1] bg-white px-4 py-3 ${fontSize} outline-none transition-all duration-300 focus:ring-2`}
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
          className="rounded-xl bg-gradient-to-r from-[#03396c] to-[#005b96] px-5 py-3 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-36"
        >
          Translate
        </button>
      </div>
    </div>
  );
}
