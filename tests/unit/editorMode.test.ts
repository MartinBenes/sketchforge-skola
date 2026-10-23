import { afterEach, describe, expect, it, vi } from "vitest";
import { EDITOR_MODE_STORAGE_KEY, getEditorModeStorage, normalizeEditorMode, readStoredEditorMode, storeEditorMode } from "@/lib/editorMode";

afterEach(() => vi.unstubAllGlobals());

describe("editor environment preference", () => {
  it("keeps the full editor as the default when a stored preference is missing or invalid", () => {
    for (const value of [null, undefined, "", "unexpected", true, { mode: "school" }]) {
      expect(normalizeEditorMode(value)).toBe("full");
    }
    expect(normalizeEditorMode("full")).toBe("full");
    expect(normalizeEditorMode("school")).toBe("school");
  });

  it("saves and restores the environment separately from project data", () => {
    const originalProjects = '[{"id":"existing-project","name":"Můj model"}]';
    const values = new Map<string, string>([["sketchForge.projects", originalProjects]]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    expect(readStoredEditorMode(storage)).toBe("full");
    storeEditorMode(storage, "school");
    expect(values.get(EDITOR_MODE_STORAGE_KEY)).toBe("school");
    expect(readStoredEditorMode(storage)).toBe("school");
    storeEditorMode(storage, "full");
    expect(readStoredEditorMode(storage)).toBe("full");
    expect(values.get("sketchForge.projects")).toBe(originalProjects);
    expect(values.size).toBe(2);
  });

  it("remains usable when storage reads and writes are blocked", () => {
    const blockedStorage = {
      getItem: () => { throw new Error("Storage blocked"); },
      setItem: () => { throw new Error("Storage full"); },
    };

    for (const storage of [null, undefined, blockedStorage]) {
      expect(readStoredEditorMode(storage)).toBe("full");
      expect(() => storeEditorMode(storage, "school")).not.toThrow();
    }
  });

  it("does not require a browser during server rendering and handles a blocked localStorage getter", () => {
    expect(getEditorModeStorage()).toBeNull();
    vi.stubGlobal("window", Object.defineProperty({}, "localStorage", {
      get: () => { throw new Error("Storage access denied"); },
    }));
    expect(getEditorModeStorage()).toBeNull();
  });
});
