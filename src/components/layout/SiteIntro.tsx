"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";

const INTRO_TEXT = ["Rodrigo Vieira"];
const INTRO_FONT = { fontSize: "76px", fontWeight: 550 };
const INTRO_ANIMATION = {
  fadeInDuration: 0.35,
  waitDuration: 0.55,
  vaporizeDuration: 1.25,
};

export function SiteIntro({
  onComplete,
}: {
  onComplete: (showVideo: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const priorOverflow = useRef<string | null>(null);
  const finished = useRef(false);
  const [playing, setPlaying] = useState(false);
  const finish = useCallback((showVideo = true) => {
    if (finished.current) return;
    finished.current = true;
    dialog.current?.close();
    setPlaying(false);
    if (priorOverflow.current !== null) {
      document.documentElement.style.overflow = priorOverflow.current;
      priorOverflow.current = null;
    }
    onComplete(showVideo);
  }, [onComplete]);
  useEffect(() => {
    finished.current = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (window.location.hash || !dialog.current?.showModal) {
      finish(false);
      return;
    }
    if (preference.matches) {
      finish();
      return;
    }
    dialog.current.showModal();
    setPlaying(true);
    priorOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const timeout = window.setTimeout(finish, 4200);
    function preferenceChanged() {
      if (preference.matches) finish();
    }
    preference.addEventListener("change", preferenceChanged);
    return () => {
      clearTimeout(timeout);
      preference.removeEventListener("change", preferenceChanged);
      if (priorOverflow.current !== null) {
        document.documentElement.style.overflow = priorOverflow.current;
        priorOverflow.current = null;
      }
      dialog.current?.close();
    };
  }, [finish]);
  return (
    <dialog
      ref={dialog}
      className="site-intro"
      aria-label="Apresentação Rodrigo Vieira"
      onCancel={(event) => {
        event.preventDefault();
        finish();
      }}
    >
      <div className="site-intro-content">
        <p className="intro-kicker">MENTORIA EM GESTÃO DE LOCAÇÃO</p>
        {playing && (
          <VaporizeTextCycle
            texts={INTRO_TEXT}
            font={INTRO_FONT}
            color="rgb(228, 200, 140)"
            spread={4}
            density={5}
            animation={INTRO_ANIMATION}
            direction="left-to-right"
            alignment="center"
            tag={Tag.P}
            once
            onComplete={finish}
          />
        )}
        <span className="intro-rule" aria-hidden="true" />
      </div>
      <button className="intro-skip" type="button" onClick={() => finish()}>
        Entrar no site <span aria-hidden="true">↗</span>
      </button>
    </dialog>
  );
}
