"use client";

import { publicPath } from "@/lib/publicPath";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const KEY_TAG_STEP_STORAGE_KEY = "sketchforge:key-tag-tutorial-step";

type TutorialDimension = {
  label: "Length" | "Width" | "Height";
  value: string;
  slider: number;
};

type TutorialStep = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  dimensions?: TutorialDimension[];
  snapGrid?: string;
};

const STEPS: TutorialStep[] = [
  {
    eyebrow: "Než začnete",
    title: "Vytvořte přívěsek na klíče",
    body: "Nastavte krok mřížky na 0,5 mm a sestavte přívěsek na klíče z jednoduchých tvarů.",
    image: "/assets/challenges/key-tag/01-finished-target.png",
    alt: "Hotový přívěsek na klíče na pracovní rovině SketchForge",
    snapGrid: "0,5 mm",
  },
  {
    eyebrow: "Krok 1",
    title: "Vytvořte střed",
    body: "Přidejte kvádr a nastavte jeho velikost v panelu tvaru.",
    image: "/assets/challenges/key-tag/02-middle-box.png",
    alt: "Středový kvádr přívěsku na klíče ve SketchForge",
    dimensions: [
      { label: "Length", value: "25,50 mm", slider: 38 },
      { label: "Width", value: "11,50 mm", slider: 20 },
      { label: "Height", value: "1,00 mm", slider: 5 },
    ],
  },
  {
    eyebrow: "Krok 2",
    title: "Přidejte levý zaoblený konec",
    body: "Přidejte válec v režimu Těleso a umístěte jej tak, aby z poloviny překrýval levý konec kvádru.",
    image: "/assets/challenges/key-tag/03-left-round-end.png",
    alt: "Válec v režimu Těleso přidaný k levému konci přívěsku na klíče",
    dimensions: [
      { label: "Length", value: "11,50 mm", slider: 20 },
      { label: "Width", value: "11,50 mm", slider: 20 },
      { label: "Height", value: "1,00 mm", slider: 5 },
    ],
  },
  {
    eyebrow: "Krok 3",
    title: "Vytvořte druhý konec",
    body: "Duplikujte válec v režimu Těleso a umístěte kopii na pravý konec.",
    image: "/assets/challenges/key-tag/04-right-round-end.png",
    alt: "Dva válce v režimu Těleso tvoří oba zaoblené konce přívěsku na klíče",
  },
  {
    eyebrow: "Krok 4",
    title: "Zamkněte levý válec",
    body: "Vyberte levý válec v režimu Těleso a stiskněte Zamknout. Bude sloužit jako reference pro zarovnání.",
    image: "/assets/challenges/key-tag/05-select-left-circle.png",
    alt: "Levý válec v režimu Těleso vybraný na pracovní rovině SketchForge",
  },
  {
    eyebrow: "Krok 5",
    title: "Vytvořte otvor",
    body: "Přidejte další válec, nastavte jeho velikost a změňte režim z Těleso na Otvor.",
    image: "/assets/challenges/key-tag/06-hole-cylinder.png",
    alt: "Malý válec v režimu Otvor přidaný poblíž levého konce přívěsku na klíče",
    dimensions: [
      { label: "Length", value: "3,00 mm", slider: 8 },
      { label: "Width", value: "3,00 mm", slider: 8 },
      { label: "Height", value: "2,00 mm", slider: 7 },
    ],
  },
  {
    eyebrow: "Krok 6",
    title: "Zarovnejte otvor",
    body: "Vyberte otvor a zamčený levý válec. Stiskněte Zarovnat a na obou vodorovných osách vyberte střed.",
    image: "/assets/challenges/key-tag/07-align-hole.png",
    alt: "Otvor zarovnaný na střed levého válce v režimu Těleso",
  },
  {
    eyebrow: "Krok 7",
    title: "Odemkněte válec",
    body: "Znovu vyberte levý válec v režimu Těleso a stiskněte Odemknout.",
    image: "/assets/challenges/key-tag/08-unlock-left-circle.png",
    alt: "Levý válec v režimu Těleso znovu vybraný po zarovnání otvoru",
  },
  {
    eyebrow: "Krok 8",
    title: "Seskupte přívěsek na klíče",
    body: "Vyberte kvádr, oba válce v režimu Těleso a otvor. Stiskněte Seskupit.",
    image: "/assets/challenges/key-tag/09-grouped-key-tag.png",
    alt: "Hotový seskupený přívěsek na klíče vybraný ve SketchForge",
  },
];

function storedStepIndex() {
  if (typeof window === "undefined") return 0;
  const parsed = Number.parseInt(window.localStorage.getItem(KEY_TAG_STEP_STORAGE_KEY) ?? "0", 10);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(STEPS.length - 1, parsed)) : 0;
}

export function KeyTagTutorialPanel({
  onFinish,
  collapsed = false,
  onCollapsedChange,
}: {
  onFinish?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const [stepIndex, setStepIndex] = useState(storedStepIndex);
  const step = STEPS[stepIndex];
  const first = stepIndex === 0;
  const last = stepIndex === STEPS.length - 1;

  const goToStep = (index: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, index));
    setStepIndex(next);
    window.localStorage.setItem(KEY_TAG_STEP_STORAGE_KEY, String(next));
  };

  if (collapsed) {
    return (
      <aside className="key-tag-tutorial-panel key-tag-tutorial-panel-collapsed" aria-label="Pokyny k výzvě Přívěsek na klíče">
        <button
          type="button"
          className="key-tag-tutorial-expand"
          title="Rozbalit pokyny k výzvě"
          aria-label="Rozbalit pokyny k výzvě"
          onClick={() => onCollapsedChange?.(false)}
        >
          <ChevronLeft size={19} />
        </button>
        <span className="key-tag-tutorial-collapsed-label">Přívěsek na klíče</span>
        <span className="key-tag-tutorial-collapsed-count">{stepIndex + 1}/{STEPS.length}</span>
      </aside>
    );
  }

  return (
    <aside
      className="key-tag-tutorial-panel"
      aria-label="Pokyny k výzvě Přívěsek na klíče"
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <header className="key-tag-tutorial-header">
        <div>
          <span>Výzva 1</span>
          <strong>Přívěsek na klíče</strong>
        </div>
        <div className="key-tag-tutorial-header-actions">
          <span className="key-tag-tutorial-count">{stepIndex + 1} / {STEPS.length}</span>
          <button
            type="button"
            className="key-tag-tutorial-collapse"
            title="Sbalit pokyny k výzvě"
            aria-label="Sbalit pokyny k výzvě"
            onClick={() => onCollapsedChange?.(true)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <div className="key-tag-tutorial-body">
        <div className="key-tag-tutorial-copy">
          <span className="key-tag-tutorial-eyebrow">{step.eyebrow}</span>
          <h2>{step.title}</h2>
          <p>{step.body}</p>

          {step.snapGrid ? (
            <div className="key-tag-snap-row" aria-label={`Krok mřížky ${step.snapGrid}`}>
              <span>Krok mřížky</span>
              <strong>{step.snapGrid}</strong>
            </div>
          ) : null}

          {step.dimensions ? (
            <div className="key-tag-tutorial-dimensions" aria-label="Požadované rozměry">
              {step.dimensions.map((dimension) => (
                <div className="key-tag-tutorial-dimension-control" key={dimension.label}>
                  <div className="key-tag-tutorial-dimension-heading">
                    <span>{{ Length: "Délka", Width: "Šířka", Height: "Výška" }[dimension.label]}</span>
                    <strong>{dimension.value}</strong>
                  </div>
                  <div className="key-tag-tutorial-slider" aria-hidden="true">
                    <span style={{ width: `${dimension.slider}%` }} />
                    <i style={{ left: `${dimension.slider}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="key-tag-tutorial-image-box">
          <img className="key-tag-tutorial-capture" src={publicPath(step.image)} alt={step.alt} draggable={false} />
        </div>
      </div>

      <footer className="key-tag-tutorial-footer">
        <button type="button" className="secondary" disabled={first} onClick={() => goToStep(stepIndex - 1)}>
          <ChevronLeft size={17} /> Předchozí
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => {
            if (last) {
              window.localStorage.removeItem(KEY_TAG_STEP_STORAGE_KEY);
              onFinish?.();
              return;
            }
            goToStep(stepIndex + 1);
          }}
        >
          {last ? "Dokončit" : "Další"} {!last ? <ChevronRight size={17} /> : null}
        </button>
      </footer>
    </aside>
  );
}
