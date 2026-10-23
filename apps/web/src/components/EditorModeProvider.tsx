"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EDITOR_MODE_STORAGE_KEY, getEditorModeStorage, normalizeEditorMode, readStoredEditorMode, storeEditorMode, type EditorMode } from "@/lib/editorMode";

type EditorModeContextValue = {
  mode: EditorMode;
  isSchoolMode: boolean;
  setMode: (mode: EditorMode) => void;
};

const EditorModeContext = createContext<EditorModeContextValue | null>(null);

export function EditorModeProvider({ children }: { children: ReactNode }) {
  // Keep the initial client render identical to the server; load this browser's preference after mounting.
  const [mode, setCurrentMode] = useState<EditorMode>("full");

  useEffect(() => {
    const storage = getEditorModeStorage();
    setCurrentMode(readStoredEditorMode(storage));
    const onStorageChange = (event: StorageEvent) => {
      if (!storage || event.storageArea !== storage) return;
      if (event.key === EDITOR_MODE_STORAGE_KEY || event.key === null) {
        setCurrentMode(normalizeEditorMode(event.newValue));
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const setMode = useCallback((nextMode: EditorMode) => {
    const normalized = normalizeEditorMode(nextMode);
    setCurrentMode(normalized);
    storeEditorMode(getEditorModeStorage(), normalized);
  }, []);

  const value = useMemo(() => ({ mode, isSchoolMode: mode === "school", setMode }), [mode, setMode]);

  return <EditorModeContext.Provider value={value}>{children}</EditorModeContext.Provider>;
}

export function useEditorMode() {
  const context = useContext(EditorModeContext);
  if (!context) throw new Error("useEditorMode must be used within EditorModeProvider");
  return context;
}
