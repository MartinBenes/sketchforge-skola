export const EDITOR_MODE_STORAGE_KEY = "sketchForge.editorMode";

export type EditorMode = "full" | "school";

export function normalizeEditorMode(value: unknown): EditorMode {
  return value === "school" ? "school" : "full";
}

export function getEditorModeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredEditorMode(storage: Pick<Storage, "getItem"> | null | undefined): EditorMode {
  if (!storage) return "full";
  try {
    return normalizeEditorMode(storage.getItem(EDITOR_MODE_STORAGE_KEY));
  } catch {
    return "full";
  }
}

export function storeEditorMode(storage: Pick<Storage, "setItem"> | null | undefined, mode: EditorMode) {
  if (!storage) return;
  try {
    storage.setItem(EDITOR_MODE_STORAGE_KEY, mode);
  } catch {
    // The interface can still be simplified for this session without persistent storage.
  }
}
