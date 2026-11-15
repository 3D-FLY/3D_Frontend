import { useMemo } from "react";

// Per-browser draft storage for long forms. Storage can be missing or throw
// (private mode, blocked site data), so every access is guarded and the form
// works the same without it.

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface StoredDraft<T> {
  v: 1;
  savedAt: number;
  data: T;
}

export interface FormDraftStorage<T> {
  load: () => T | null;
  save: (data: T) => void;
  clear: () => void;
}

export default function useFormDraft<T>(key: string): FormDraftStorage<T> {
  return useMemo(
    () => ({
      load() {
        try {
          const raw = window.localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw) as StoredDraft<T>;
          if (parsed?.v !== 1 || Date.now() - parsed.savedAt > MAX_AGE_MS) {
            window.localStorage.removeItem(key);
            return null;
          }
          return parsed.data;
        } catch {
          return null;
        }
      },
      save(data: T) {
        try {
          const draft: StoredDraft<T> = { v: 1, savedAt: Date.now(), data };
          window.localStorage.setItem(key, JSON.stringify(draft));
        } catch {
          // Storage unavailable or full: drafts are a convenience only.
        }
      },
      clear() {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // ignore
        }
      },
    }),
    [key],
  );
}
