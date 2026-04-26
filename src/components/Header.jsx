import AudienceToggle from "./AudienceToggle";

export default function Header({ audience, AUDIENCES, onAudienceChange }) {
  return (
    <header
      className="sticky top-0 z-20 border-b bg-white/80 px-6 py-3 backdrop-blur transition-all duration-300"
      style={{ borderBottomColor: "#6497b1" }}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="text-base font-black tracking-tight text-[#011f4b]">
          MediClear
        </div>
        <AudienceToggle
          audience={audience}
          audiences={AUDIENCES}
          accentColor="#005b96"
          onChange={onAudienceChange}
        />
      </div>
    </header>
  );
}
