let currentUtterance = null;

export function speakText(text, audienceConfig) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = audienceConfig?.ttsRate ?? 1.0;
    utterance.pitch = audienceConfig?.ttsPitch ?? 1.0;
    utterance.volume = 1;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking() {
  if (!window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}
