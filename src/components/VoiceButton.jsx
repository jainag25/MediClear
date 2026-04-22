import { useEffect, useState } from "react";
import { isSpeaking, speakText, stopSpeaking } from "../lib/elevenlabs";

export default function VoiceButton({ text, audienceConfig, accentColor }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaying(isSpeaking());
    }, 180);
    return () => clearInterval(id);
  }, []);

  const handleToggle = async () => {
    if (!text?.trim()) return;

    if (isSpeaking()) {
      stopSpeaking();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    await speakText(text, audienceConfig);
    setPlaying(false);
  };

  return (
    <button
      type="button"
      aria-label="Read translated explanation aloud"
      aria-pressed={playing}
      onClick={handleToggle}
      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300"
      style={{
        borderColor: accentColor,
        color: playing ? "#FFFFFF" : accentColor,
        background: playing ? accentColor : "#FFFFFF",
      }}
    >
      {playing ? "⏹ Stop" : "🔊 Read Aloud"}
    </button>
  );
}
