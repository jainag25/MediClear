export const AUDIENCES = {
  kids: {
    key: "kids",
    label: "Kids",
    emoji: "",
    description: "Fun analogies for ages 8-14",
    promptGuidance:
      "Explain like you're talking to a curious 10-year-old. Use fun analogies - LEGO bricks, superheroes, video games, or animals. Keep sentences very short.",
    fontSize: "text-lg",
    fontFamily: "font-rounded",
    accentColor: "#FF6B6B",
    bgColor: "#FFF9F0",
    cardColor: "#FFF3E0",
    ttsRate: 1.0,
    ttsPitch: 1.2,
    ttsVoicePreference: "friendly",
  },
  adult: {
    key: "adult",
    label: "Adult",
    emoji: "",
    description: "Clear, plain English",
    promptGuidance:
      "Use clear, plain English for an adult with no medical background. No jargon. Reassuring but honest. Assume they want full information.",
    fontSize: "text-base",
    fontFamily: "font-sans",
    accentColor: "#2E86AB",
    bgColor: "#F0F7FF",
    cardColor: "#E8F4FD",
    ttsRate: 1.0,
    ttsPitch: 1.0,
    ttsVoicePreference: "professional",
  },
  elderly: {
    key: "elderly",
    label: "Elderly",
    emoji: "",
    description: "Warm, slow, simple language",
    promptGuidance:
      "Use simple, warm, and reassuring language for an older adult. Short sentences. Avoid alarming words. Speak kindly and patiently. Define any necessary medical words.",
    fontSize: "text-xl",
    fontFamily: "font-serif",
    accentColor: "#5C6BC0",
    bgColor: "#F3F0FF",
    cardColor: "#EDE7FF",
    ttsRate: 0.82,
    ttsPitch: 0.95,
    ttsVoicePreference: "warm",
  },
};

export const DEFAULT_AUDIENCE = "adult";
