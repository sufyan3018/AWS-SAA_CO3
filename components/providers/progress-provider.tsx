"use client";

import * as React from "react";
import type { ProgressState } from "@/types";

const STORAGE_KEY = "aws-saa-hub:progress";
const MAX_RECENT = 8;

const EMPTY_STATE: ProgressState = {
  completed: [],
  bookmarks: [],
  recent: [],
};

interface ProgressContextValue {
  /** True once the persisted state has been read from localStorage. */
  isReady: boolean;
  completed: string[];
  bookmarks: string[];
  recent: string[];
  isCompleted: (slug: string) => boolean;
  isBookmarked: (slug: string) => boolean;
  toggleCompleted: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
  visitService: (slug: string) => void;
  completedCount: () => number;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

function loadState(): ProgressState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed: parsed.completed ?? [],
      bookmarks: parsed.bookmarks ?? [],
      recent: parsed.recent ?? [],
      lastVisited: parsed.lastVisited,
    };
  } catch {
    return EMPTY_STATE;
  }
}

function saveState(state: ProgressState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private browsing, quota) — fail silently.
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(EMPTY_STATE);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setState(loadState());
    setIsReady(true);
  }, []);

  const persist = React.useCallback((next: ProgressState) => {
    setState(next);
    saveState(next);
  }, []);

  const toggleCompleted = React.useCallback(
    (slug: string) => {
      const has = state.completed.includes(slug);
      const completed = has
        ? state.completed.filter((s) => s !== slug)
        : [...state.completed, slug];
      persist({ ...state, completed });
    },
    [state, persist]
  );

  const toggleBookmark = React.useCallback(
    (slug: string) => {
      const has = state.bookmarks.includes(slug);
      const bookmarks = has
        ? state.bookmarks.filter((s) => s !== slug)
        : [...state.bookmarks, slug];
      persist({ ...state, bookmarks });
    },
    [state, persist]
  );

  const visitService = React.useCallback(
    (slug: string) => {
      const recent = [slug, ...state.recent.filter((s) => s !== slug)].slice(
        0,
        MAX_RECENT
      );
      persist({ ...state, recent, lastVisited: slug });
    },
    [state, persist]
  );

  const value = React.useMemo<ProgressContextValue>(
    () => ({
      isReady,
      completed: state.completed,
      bookmarks: state.bookmarks,
      recent: state.recent,
      isCompleted: (slug) => state.completed.includes(slug),
      isBookmarked: (slug) => state.bookmarks.includes(slug),
      toggleCompleted,
      toggleBookmark,
      visitService,
      completedCount: () => state.completed.length,
    }),
    [state, isReady, toggleCompleted, toggleBookmark, visitService]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
