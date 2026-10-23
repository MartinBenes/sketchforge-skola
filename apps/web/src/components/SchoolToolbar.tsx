"use client";

import { publicPath } from "@/lib/publicPath";
import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, Combine, Copy, Download, FolderOpen, House, Redo2, Save, Trash2, Undo2, Ungroup, AlignCenter } from "lucide-react";
import { EditorModeControl } from "./EditorModeControl";
import { toolbarShapeAssets, type ToolbarShapeAsset } from "@/lib/shapeCatalog";

const basicShapes = toolbarShapeAssets.filter((shape) => ["box", "cylinder", "sphere", "cone", "pyramid", "wedge", "text"].includes(shape.id));

type SchoolToolbarProps = {
  projectName: string;
  onProjectNameChange?: (name: string) => void;
  onHome?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  canGroup: boolean;
  canUngroup: boolean;
  canAlign: boolean;
  alignMode: boolean;
  canPrint: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onAlign: () => void;
  onDrop: () => void;
  onOpen: () => void;
  onSave: () => void;
  onPrint: () => void;
  onAddShape: (shape: ToolbarShapeAsset) => void;
};

export function SchoolToolbar(props: SchoolToolbarProps) {
  const [name, setName] = useState(props.projectName);
  const cancelNameEdit = useRef(false);
  useEffect(() => setName(props.projectName), [props.projectName]);
  const commitName = () => {
    if (cancelNameEdit.current) {
      cancelNameEdit.current = false;
      setName(props.projectName);
      return;
    }
    const trimmed = name.trim();
    if (trimmed) props.onProjectNameChange?.(trimmed);
    setName(trimmed || props.projectName);
  };

  return (
    <header className="school-toolbar" aria-label="Nástroje pro 4. a 5. ročník">
      <div className="school-toolbar-header">
        <button type="button" className="school-home-button" onClick={props.onHome} disabled={!props.onHome}><House aria-hidden="true" /><span>Projekty</span></button>
        <label className="school-project-name"><span>Název práce</span>
          <input aria-label="Název práce" value={name} maxLength={80} readOnly={!props.onProjectNameChange} onChange={(event) => setName(event.target.value)} onBlur={commitName}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") { cancelNameEdit.current = true; event.currentTarget.blur(); }
            }} />
        </label>
        <EditorModeControl />
      </div>
      <div className="school-toolbar-actions" role="group" aria-label="Úpravy modelu">
        <button type="button" className="school-tool-button" disabled={!props.canUndo} onClick={props.onUndo}><Undo2 aria-hidden="true" /><span>Zpět</span></button>
        <button type="button" className="school-tool-button" disabled={!props.canRedo} onClick={props.onRedo}><Redo2 aria-hidden="true" /><span>Znovu</span></button>
        <button type="button" className="school-tool-button" disabled={!props.hasSelection} onClick={props.onDuplicate}><Copy aria-hidden="true" /><span>Kopie</span></button>
        <button type="button" className="school-tool-button" disabled={!props.hasSelection} onClick={props.onDelete}><Trash2 aria-hidden="true" /><span>Smazat</span></button>
        <button type="button" className="school-tool-button" disabled={!props.canGroup} onClick={props.onGroup}><Combine aria-hidden="true" /><span>Spojit</span></button>
        <button type="button" className="school-tool-button" disabled={!props.canUngroup} onClick={props.onUngroup}><Ungroup aria-hidden="true" /><span>Rozdělit</span></button>
        <button type="button" className="school-tool-button" disabled={!props.canAlign} aria-pressed={props.alignMode} onClick={props.onAlign}><AlignCenter aria-hidden="true" /><span>Zarovnat</span></button>
        <button type="button" className="school-tool-button" disabled={!props.hasSelection} onClick={props.onDrop}><ArrowDownToLine aria-hidden="true" /><span>Na podložku</span></button>
        <div className="school-toolbar-files" role="group" aria-label="Soubory">
          <button type="button" className="school-tool-button" onClick={props.onOpen}><FolderOpen aria-hidden="true" /><span>Otevřít práci</span></button>
          <button type="button" className="school-tool-button" onClick={props.onSave}><Save aria-hidden="true" /><span>Uložit práci</span></button>
          <button type="button" className="school-tool-button" disabled={!props.canPrint} onClick={props.onPrint}><Download aria-hidden="true" /><span>Pro 3D tisk</span></button>
        </div>
      </div>
      <div className="school-shape-palette" role="group" aria-label="Přidat tvar">
        {basicShapes.map((shape) => <button key={shape.id} type="button" className="school-shape-button" onClick={() => props.onAddShape(shape)}>
          <img src={publicPath(shape.menuIcon)} alt="" draggable={false} /><span>{shape.name}</span>
        </button>)}
      </div>
      <p className="school-toolbar-help">{props.hasSelection
        ? "Rozměry a barvu změň vpravo. Více tvarů vybereš klikáním se stisknutou klávesou Shift."
        : "Klikni na tvar a přidej ho na podložku. Potom ho můžeš přesunout tažením myší."}</p>
    </header>
  );
}

export function SchoolFilePanel({ kind, projectName, shapeCount, holeCount, busy, onClose, onDownload }: {
  kind: "save" | "print";
  projectName: string;
  shapeCount: number;
  holeCount: number;
  busy: boolean;
  onClose: () => void;
  onDownload: (name: string) => void;
}) {
  const [name, setName] = useState(projectName);
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    panelRef.current?.querySelector("input")?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); }
    };
    window.addEventListener("keydown", escape, true);
    return () => {
      window.removeEventListener("keydown", escape, true);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [onClose]);
  return (
    <section ref={panelRef} className="top-action-panel school-file-panel" role="dialog" aria-labelledby="school-file-title" onKeyDown={(event) => event.stopPropagation()}>
      <h2 id="school-file-title">{kind === "save" ? "Uložit rozpracovanou práci" : "Připravit soubor pro 3D tisk"}</h2>
      <p className="school-file-description">{kind === "save"
        ? "Stáhneš celou práci do souboru SKF. Příště ji otevři tlačítkem Otevřít práci a pokračuj v modelování."
        : `Stáhneš všechna viditelná tělesa (${shapeCount}) do souboru STL. Ten otevři v programu pro přípravu tisku (sliceru).`}</p>
      {kind === "print" && holeCount > 0 ? <p className="school-file-description">Na podložce jsou samostatné otvory. Aby se vyřízly, nejdřív je vyber společně s tělesem a klikni na Spojit.</p> : null}
      <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onDownload(name.trim()); }}>
        <label>Název souboru<input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label>
        <div className="school-file-actions">
          <button type="button" onClick={onClose}>Zavřít</button>
          <button type="submit" disabled={busy || !name.trim() || (kind === "print" && shapeCount === 0)}>{busy ? "Ukládám…" : kind === "save" ? "Stáhnout práci (SKF)" : "Stáhnout pro tisk (STL)"}</button>
        </div>
      </form>
    </section>
  );
}
