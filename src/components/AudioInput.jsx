import { useEffect, useRef, useState } from "react";

export default function AudioInput({
  onTranscript,
  onSubmitTranscript,
  loading,
  accentColor,
}) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const next = Array.from(event.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ")
        .trim();
      setTranscript(next);
      onTranscript?.(next);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);
      setLocalError(event?.error || "Audio capture failed.");
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current || loading) return;
    setLocalError("");

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setTranscript("");
    onTranscript?.("");
    recognitionRef.current.start();
    setListening(true);
  };

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Audio input is not supported in this browser. Please use Chrome.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label={listening ? "Stop listening" : "Start listening"}
          onClick={toggleListening}
          disabled={loading}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white transition-all duration-300 disabled:opacity-50"
          style={{ background: listening ? "#DC2626" : accentColor }}
        >
          {listening ? "Stop Mic" : "Start Mic"}
        </button>
        <button
          type="button"
          aria-label="Translate captured audio"
          onClick={() => onSubmitTranscript(transcript)}
          disabled={!transcript.trim() || loading}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          Translate Audio
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
        {transcript || "Your transcript will appear here..."}
      </div>

      {localError && (
        <p className="mt-2 text-xs text-red-600">Mic error: {localError}</p>
      )}
    </div>
  );
}
