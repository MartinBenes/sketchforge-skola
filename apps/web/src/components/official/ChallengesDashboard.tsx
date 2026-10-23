"use client";

import { publicPath } from "@/lib/publicPath";
import { AlignCenter, Box, CircleDotDashed, Group, LockKeyhole, MoveUp, Type } from "lucide-react";
import { useEditorMode } from "@/components/EditorModeProvider";
import type { ChallengeTutorialId } from "@/lib/challenges";

function KeyTagPreview() {
  return (
    <>
      <img
        className="challenge-key-tag-photo challenge-key-tag-photo-light"
        src={publicPath("/assets/challenges/key-tag/card-key-tag-light.webp")}
        alt="Hotový červený přívěsek na klíče na pracovní rovině SketchForge"
      />
      <img
        className="challenge-key-tag-photo challenge-key-tag-photo-dark"
        src={publicPath("/assets/challenges/key-tag/card-key-tag-dark.webp")}
        alt="Hotový červený přívěsek na klíče na tmavé pracovní rovině SketchForge"
      />
    </>
  );
}

function NameplatePreview() {
  return (
    <>
      <img
        className="challenge-key-tag-photo challenge-key-tag-photo-light"
        src={publicPath("/assets/challenges/nameplate/card-nameplate-light.webp")}
        alt="Hotová modrá jmenovka ALEX na pracovní rovině SketchForge"
      />
      <img
        className="challenge-key-tag-photo challenge-key-tag-photo-dark"
        src={publicPath("/assets/challenges/nameplate/card-nameplate-dark.webp")}
        alt="Hotová modrá jmenovka ALEX na tmavé pracovní rovině SketchForge"
      />
    </>
  );
}

export default function ChallengesDashboard({ onStartChallenge }: { onStartChallenge: (challenge: ChallengeTutorialId) => void }) {
  const { isSchoolMode, setMode } = useEditorMode();
  const startChallenge = (challenge: ChallengeTutorialId) => {
    if (isSchoolMode) setMode("full");
    onStartChallenge(challenge);
  };

  return (
    <div className="challenge-key-tag-page">
      <div className="challenge-key-tag-rail" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="challenge-card-stack">
        {isSchoolMode ? (
          <p className="school-challenge-notice">Tyto návody používají i pokročilé nástroje. Spustí se v plném editoru.</p>
        ) : null}
        <article className="challenge-key-tag-card">
          <div className="challenge-key-tag-preview">
            <KeyTagPreview />
          </div>

          <div className="challenge-key-tag-content">
            <div className="challenge-key-tag-title-row">
              <span>01</span>
              <h2>Přívěsek na klíče</h2>
            </div>

            <p>
              {isSchoolMode ? <><strong>Návod pro plný editor</strong><br /></> : null}
              Vytvořte svůj první přívěsek na klíče z jednoduchých tvarů.
            </p>

            <div className="challenge-key-tag-skills" aria-label="Dovednosti procvičované v této výzvě">
              <span><Box size={16} aria-hidden="true" /> Základní tvary</span>
              <span><AlignCenter size={16} aria-hidden="true" /> Zarovnat</span>
              <span><CircleDotDashed size={16} aria-hidden="true" /> Otvor</span>
              <span><LockKeyhole size={16} aria-hidden="true" /> Zamknout</span>
              <span><Group size={16} aria-hidden="true" /> Seskupit</span>
            </div>

            <button type="button" className="challenge-key-tag-start" onClick={() => startChallenge("key-tag")}>
              {isSchoolMode ? "Spustit v plném editoru" : "Spustit výzvu"}
            </button>
          </div>
        </article>

        <article className="challenge-key-tag-card">
          <div className="challenge-key-tag-preview">
            <NameplatePreview />
          </div>

          <div className="challenge-key-tag-content">
            <div className="challenge-key-tag-title-row">
              <span>02</span>
              <h2>Jmenovka na míru</h2>
            </div>

            <p>
              {isSchoolMode ? <><strong>Návod pro plný editor</strong><br /></> : null}
              Vytvořte jmenovku pro 3D tisk se zaoblenými hranami a vystouplým vlastním textem.
            </p>

            <div className="challenge-key-tag-skills" aria-label="Dovednosti procvičované v této výzvě">
              <span><Box size={16} aria-hidden="true" /> Kvádr</span>
              <span><CircleDotDashed size={16} aria-hidden="true" /> Zaoblení</span>
              <span><Type size={16} aria-hidden="true" /> Text</span>
              <span><MoveUp size={16} aria-hidden="true" /> Zvednutí</span>
              <span><AlignCenter size={16} aria-hidden="true" /> Zarovnat</span>
              <span><Group size={16} aria-hidden="true" /> Seskupit</span>
            </div>

            <button type="button" className="challenge-key-tag-start" onClick={() => startChallenge("nameplate")}>
              {isSchoolMode ? "Spustit v plném editoru" : "Spustit výzvu"}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
