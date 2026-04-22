export default function AudienceToggle({
  audience,
  audiences,
  accentColor,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2">
      {Object.values(audiences).map((item) => {
        const active = audience.key === item.key;
        return (
          <button
            key={item.key}
            type="button"
            aria-label={`Switch to ${item.label} mode`}
            onClick={() => onChange(item.key)}
            className="rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-300"
            style={{
              background: active ? accentColor : "#FFFFFF",
              color: active ? "#FFFFFF" : "#111827",
              borderColor: active ? accentColor : "#D1D5DB",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
