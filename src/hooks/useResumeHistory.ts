import { useState, useCallback, useRef, useEffect } from 'react';
import { ResumeData } from '../types/resume';

const MAX_HISTORY_LIMIT = 10;
const COALESCE_TIMEOUT_MS = 600; // Group rapid continuous typing within 600ms into a single undo step

export interface UseResumeHistoryReturn {
  resume: ResumeData;
  setResume: (
    updater: ResumeData | ((prev: ResumeData) => ResumeData),
    options?: { recordHistory?: boolean; immediate?: boolean }
  ) => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  maxHistory: number;
  historyStack: ResumeData[];
  clearHistory: () => void;
}

export function useResumeHistory(
  initialResume: ResumeData,
  storageKey?: string
): UseResumeHistoryReturn {
  // Current present state
  const [present, setPresent] = useState<ResumeData>(initialResume);

  // Past stack (up to 10 previous snapshots)
  const [past, setPast] = useState<ResumeData[]>([]);

  // Future stack (for Redo)
  const [future, setFuture] = useState<ResumeData[]>([]);

  // Refs for tracking recent keystroke debouncing & state without re-render lag
  const presentRef = useRef<ResumeData>(present);
  presentRef.current = present;

  const pastRef = useRef<ResumeData[]>(past);
  pastRef.current = past;

  const lastEditTimeRef = useRef<number>(0);
  const baselineSnapshotRef = useRef<ResumeData>(initialResume);

  // Helper to deep-compare if two resumes are identical (avoids pushing duplicate history)
  const isEquivalent = (a: ResumeData, b: ResumeData): boolean => {
    if (a === b) return true;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  /**
   * Updates resume state with automatic history stack recording.
   * Capped at MAX_HISTORY_LIMIT (10 edits).
   */
  const setResume = useCallback(
    (
      updater: ResumeData | ((prev: ResumeData) => ResumeData),
      options?: { recordHistory?: boolean; immediate?: boolean }
    ) => {
      const recordHistory = options?.recordHistory ?? true;
      const immediate = options?.immediate ?? false;

      const currentPresent = presentRef.current;
      const nextPresent = typeof updater === 'function' ? updater(currentPresent) : updater;

      // Ignore no-op updates
      if (isEquivalent(currentPresent, nextPresent)) {
        return;
      }

      if (!recordHistory) {
        setPresent(nextPresent);
        baselineSnapshotRef.current = nextPresent;
        return;
      }

      const now = Date.now();
      const timeSinceLastEdit = now - lastEditTimeRef.current;
      lastEditTimeRef.current = now;

      // Determine if this is a structural change (e.g. array length changed, different sections)
      const isStructuralChange =
        immediate ||
        (currentPresent.experience?.length || 0) !== (nextPresent.experience?.length || 0) ||
        (currentPresent.skills?.length || 0) !== (nextPresent.skills?.length || 0) ||
        (currentPresent.education?.length || 0) !== (nextPresent.education?.length || 0) ||
        (currentPresent.projects?.length || 0) !== (nextPresent.projects?.length || 0) ||
        (currentPresent.certifications?.length || 0) !== (nextPresent.certifications?.length || 0) ||
        (currentPresent.languages?.length || 0) !== (nextPresent.languages?.length || 0);

      if (isStructuralChange || timeSinceLastEdit > COALESCE_TIMEOUT_MS) {
        // Push current state to past stack, preserving last 10
        setPast((prevPast) => {
          const newPast = [...prevPast, currentPresent];
          if (newPast.length > MAX_HISTORY_LIMIT) {
            return newPast.slice(newPast.length - MAX_HISTORY_LIMIT);
          }
          return newPast;
        });
        baselineSnapshotRef.current = currentPresent;
      } else {
        // Continuous typing within coalesce window:
        // Ensure baseline snapshot is at least on the past stack if past was empty
        setPast((prevPast) => {
          if (prevPast.length === 0) {
            return [baselineSnapshotRef.current];
          }
          return prevPast;
        });
      }

      // Any new edit clears future redo stack
      setFuture([]);
      setPresent(nextPresent);
    },
    []
  );

  /**
   * Reverts to the previous edit in the history stack.
   */
  const undo = useCallback((): boolean => {
    const currentPast = pastRef.current;
    if (currentPast.length === 0) return false;

    const previousState = currentPast[currentPast.length - 1];
    const newPast = currentPast.slice(0, currentPast.length - 1);
    const currentPresent = presentRef.current;

    setPast(newPast);
    setFuture((prevFuture) => {
      const newFuture = [currentPresent, ...prevFuture];
      if (newFuture.length > MAX_HISTORY_LIMIT) {
        return newFuture.slice(0, MAX_HISTORY_LIMIT);
      }
      return newFuture;
    });

    setPresent(previousState);
    baselineSnapshotRef.current = previousState;
    lastEditTimeRef.current = 0; // Reset typing debounce timer
    return true;
  }, []);

  /**
   * Re-applies the next edit in the future stack.
   */
  const redo = useCallback((): boolean => {
    if (future.length === 0) return false;

    const nextState = future[0];
    const newFuture = future.slice(1);
    const currentPresent = presentRef.current;

    setFuture(newFuture);
    setPast((prevPast) => {
      const newPast = [...prevPast, currentPresent];
      if (newPast.length > MAX_HISTORY_LIMIT) {
        return newPast.slice(newPast.length - MAX_HISTORY_LIMIT);
      }
      return newPast;
    });

    setPresent(nextState);
    baselineSnapshotRef.current = nextState;
    lastEditTimeRef.current = 0;
    return true;
  }, [future]);

  /**
   * Clears the undo/redo history stacks.
   */
  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
    baselineSnapshotRef.current = presentRef.current;
  }, []);

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z for Undo, Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y for Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier) return;

      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused =
        activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      // Redo shortcut: Cmd+Shift+Z or Ctrl+Shift+Z or Ctrl+Y
      if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        if (!isInputFocused) {
          e.preventDefault();
          redo();
        }
      }
      // Undo shortcut: Cmd+Z or Ctrl+Z (without shift)
      else if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        // If not focused on an input element, or if user explicitly presses Ctrl+Z
        if (!isInputFocused) {
          e.preventDefault();
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    resume: present,
    setResume,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undoCount: past.length,
    redoCount: future.length,
    maxHistory: MAX_HISTORY_LIMIT,
    historyStack: past,
    clearHistory,
  };
}
