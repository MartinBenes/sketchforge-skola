"use client";

import { useId } from "react";
import { useEditorMode } from "@/components/EditorModeProvider";

export function EditorModeControl({ disabled = false }: { disabled?: boolean }) {
  const { mode, setMode } = useEditorMode();
  const labelId = useId();

  return (
    <div className="editor-mode-control" title={disabled ? "Pro změnu prostředí dokonči nebo zruš náčrt." : undefined}>
      <span id={labelId}>Prostředí</span>
      <div className="editor-mode-options" role="group" aria-labelledby={labelId}>
        <button
          className={`editor-mode-option${mode === "school" ? " active" : ""}`}
          type="button"
          disabled={disabled}
          aria-pressed={mode === "school"}
          onClick={() => setMode("school")}
        >
          4.–5. ročník
        </button>
        <button
          className={`editor-mode-option${mode === "full" ? " active" : ""}`}
          type="button"
          disabled={disabled}
          aria-pressed={mode === "full"}
          onClick={() => setMode("full")}
        >
          Plný editor
        </button>
      </div>
    </div>
  );
}

export default EditorModeControl;
