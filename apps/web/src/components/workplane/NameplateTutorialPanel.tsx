"use client";

import { publicPath } from "@/lib/publicPath";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useState } from "react";

const NAMEPLATE_STEP_STORAGE_KEY = "sketchforge:nameplate-tutorial-step";

type TutorialDimension = {
  label: "Length" | "Width" | "Height" | "Elevation";
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
  callout?: string;
};

const STEPS: TutorialStep[] = [
  {
    eyebrow: "Než začnete",
    title: "Vytvořte jmenovku",
    body: "Vytvořte zaoblený podklad, upravte text a spojte obě části do jednoho návrhu pro 3D tisk.",
    image: "/assets/challenges/nameplate/01-finished-target.webp",
    alt: "Hotová modrá jmenovka ALEX na pracovní rovině SketchForge",
    snapGrid: "0,5 mm",
  },
  {
    eyebrow: "Krok 1",
    title: "Vytvořte podklad",
    body: "Přidejte kvádr a zadejte tyto rozměry v panelu tvaru.",
    image: "/assets/challenges/nameplate/02-base-box.webp",
    alt: "Jednoduchý obdélníkový modrý podklad jmenovky",
    dimensions: [
      { label: "Length", value: "24,00 mm", slider: 24 },
      { label: "Width", value: "70,00 mm", slider: 70 },
      { label: "Height", value: "3,00 mm", slider: 12 },
    ],
  },
  {
    eyebrow: "Krok 2",
    title: "Zaoblete vnější hrany",
    body: "Vyberte podklad, stiskněte Zaoblení, vyberte vnější hrany a použijte úpravu.",
    image: "/assets/challenges/nameplate/03-rounded-base.webp",
    alt: "Modrý podklad jmenovky s mírně zaoblenými vnějšími hranami",
    callout: "Nastavte poloměr zaoblení na 1,00 mm.",
  },
  {
    eyebrow: "Krok 3",
    title: "Přidejte text",
    body: "Otevřete Tvary a přidejte Text. Nový objekt obsahuje písmeno T.",
    image: "/assets/challenges/nameplate/04-text-added.webp",
    alt: "Červené velké písmeno T na modrém podkladu jmenovky",
  },
  {
    eyebrow: "Krok 4",
    title: "Upravte text",
    body: "Do pole Text zadejte své jméno. V tomto příkladu používáme ALEX. Vyberte si libovolné písmo.",
    image: "/assets/challenges/nameplate/05-text-customized.webp",
    alt: "Vystouplý červený text ALEX umístěný mimo střed modrého podkladu",
    dimensions: [
      { label: "Height", value: "2,00 mm", slider: 9 },
    ],
  },
  {
    eyebrow: "Krok 5",
    title: "Umístěte text nahoru",
    body: "Zvedněte text tak, aby jeho spodní plocha ležela přesně na horní ploše podkladu o výšce 3 mm.",
    image: "/assets/challenges/nameplate/05-text-customized.webp",
    alt: "Vystouplý červený text ALEX na modrém podkladu jmenovky",
    dimensions: [
      { label: "Elevation", value: "3,00 mm", slider: 12 },
    ],
  },
  {
    eyebrow: "Krok 6",
    title: "Vystřeďte jméno",
    body: "Zamkněte podklad, vyberte text i podklad a pomocí Zarovnat je vystřeďte na obou vodorovných osách. Poté podklad odemkněte.",
    image: "/assets/challenges/nameplate/06-text-centered.webp",
    alt: "Červený text ALEX vystředěný na modrém podkladu jmenovky",
    callout: "Zamčený podklad zůstává na místě a slouží jako reference pro zarovnání.",
  },
  {
    eyebrow: "Krok 7",
    title: "Seskupte jmenovku",
    body: "Vyberte podklad a text a stisknutím Seskupit vytvořte jeden hotový model pro 3D tisk.",
    image: "/assets/challenges/nameplate/07-grouped-nameplate.webp",
    alt: "Hotová seskupená modrá jmenovka ALEX",
  },
];

function storedStepIndex() {
  if (typeof window === "undefined") return 0;
  const parsed = Number.parseInt(window.localStorage.getItem(NAMEPLATE_STEP_STORAGE_KEY) ?? "0", 10);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(STEPS.length - 1, parsed)) : 0;
}

function FilletButtonCoachmark() {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const target = document.querySelector<HTMLButtonElement>('button[data-sketchforge-tool="fillet"]');
    if (!target) return;

    const updatePosition = () => {
      const rect = target.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.bottom + 42,
      });
    };

    target.classList.add("nameplate-fillet-button-target");
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const observer = new ResizeObserver(updatePosition);
    observer.observe(target);

    return () => {
      target.classList.remove("nameplate-fillet-button-target");
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer.disconnect();
    };
  }, []);

  if (!position) return null;

  return (
    <div className="nameplate-fillet-coachmark" style={position} role="status">
      <ArrowUp size={30} strokeWidth={3} aria-hidden="true" />
      <strong>Klikněte na Zaoblení</strong>
    </div>
  );
}

export function NameplateTutorialPanel({
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
    window.localStorage.setItem(NAMEPLATE_STEP_STORAGE_KEY, String(next));
  };

  if (collapsed) {
    return (
      <aside className="key-tag-tutorial-panel key-tag-tutorial-panel-collapsed" aria-label="Pokyny k výzvě Jmenovka na míru">
        <button
          type="button"
          className="key-tag-tutorial-expand"
          title="Rozbalit pokyny k výzvě"
          aria-label="Rozbalit pokyny k výzvě"
          onClick={() => onCollapsedChange?.(false)}
        >
          <ChevronLeft size={19} />
        </button>
        <span className="key-tag-tutorial-collapsed-label">Jmenovka</span>
        <span className="key-tag-tutorial-collapsed-count">{stepIndex + 1}/{STEPS.length}</span>
      </aside>
    );
  }

  return (
    <>
      {stepIndex === 2 ? <FilletButtonCoachmark /> : null}
      <aside
        className="key-tag-tutorial-panel"
        aria-label="Pokyny k výzvě Jmenovka na míru"
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
      <header className="key-tag-tutorial-header">
        <div>
          <span>Výzva 2</span>
          <strong>Jmenovka na míru</strong>
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

          {step.callout ? <div className="nameplate-tutorial-callout">{step.callout}</div> : null}

          {step.dimensions ? (
            <div className="key-tag-tutorial-dimensions" aria-label="Požadované rozměry">
              {step.dimensions.map((dimension) => (
                <div className="key-tag-tutorial-dimension-control" key={dimension.label}>
                  <div className="key-tag-tutorial-dimension-heading">
                    <span>{{ Length: "Délka", Width: "Šířka", Height: "Výška", Elevation: "Zvednutí" }[dimension.label]}</span>
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
              window.localStorage.removeItem(NAMEPLATE_STEP_STORAGE_KEY);
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
    </>
  );
}
