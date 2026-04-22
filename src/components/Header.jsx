import AudienceToggle from "./AudienceToggle";

export default function Header({ audience, AUDIENCES, onAudienceChange }) {
  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-6 transition-all duration-300"
      style={{ borderBottom: `3px solid ${audience.accentColor}` }}
    >
      <div className="text-lg font-black tracking-tight text-gray-900">OncoClear</div>
      <AudienceToggle
        audience={audience}
        audiences={AUDIENCES}
        accentColor={audience.accentColor}
        onChange={onAudienceChange}
      />
    </header>
  );
}
