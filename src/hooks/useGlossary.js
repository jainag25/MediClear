import { useEffect, useState } from "react";

const STORAGE_KEY = "mediclear_glossary";

export function useGlossary() {
  const [glossary, setGlossary] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(glossary));
  }, [glossary]);

  const saveEntry = (term, result) => {
    setGlossary((prev) => {
      const exists = prev.find(
        (entry) => entry.term.toLowerCase() === term.toLowerCase(),
      );
      if (exists) return prev;
      return [{ term, result, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeEntry = (term) => {
    setGlossary((prev) => prev.filter((entry) => entry.term !== term));
  };

  const clearAll = () => setGlossary([]);

  const isSaved = (term) =>
    glossary.some((entry) => entry.term.toLowerCase() === term.toLowerCase());

  return { glossary, saveEntry, removeEntry, clearAll, isSaved };
}
