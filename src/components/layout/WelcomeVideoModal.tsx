"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/config/site";
import { videos } from "@/content/videos";
import { Icon } from "@/components/ui/Icon";

export function WelcomeVideoModal({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [started, setStarted] = useState(false);

  function playWithSound() {
    const media = video.current;
    if (!media) return;
    media.muted = false;
    media.volume = 1;
    void media.play().then(() => {
      closeButton.current?.focus({ preventScroll: true });
    }).catch(() => {
      setStarted(false);
    });
  }

  useEffect(() => {
    const modal = dialog.current;
    const media = video.current;
    if (!modal || !media) return;

    const previousOverflow = document.documentElement.style.overflow;
    modal.showModal();
    document.documentElement.style.overflow = "hidden";

    return () => {
      media.pause();
      modal.close();
      document.documentElement.style.overflow = previousOverflow;
      document.querySelector<HTMLAnchorElement>(".hero-actions .button")?.focus({
        preventScroll: true,
      });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="welcome-video-modal"
      aria-label="Apresentação da mentoria com Rodrigo Vieira em Portugal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="welcome-video-content">
        <div className="video-frame video-frame-animated">
          <video
            ref={video}
            src={videos.hero.src}
            poster={videos.hero.poster}
            width={1080}
            height={1920}
            preload="none"
            playsInline
            controls={false}
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={videos.hero.title}
            onPlay={() => setStarted(true)}
            onPause={() => setStarted(false)}
            onEnded={() => setStarted(false)}
          />
          {!started && (
            <button
              className="video-cover"
              type="button"
              style={{ backgroundImage: `url("${videos.hero.poster}")` }}
              aria-label="Reproduzir vídeo com som"
              autoFocus
              onClick={playWithSound}
            >
              <span className="video-cover-action">
                <span className="video-play-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Assistir com som</span>
              </span>
            </button>
          )}
        </div>
        <button
          ref={closeButton}
          className="welcome-video-close"
          type="button"
          aria-label="Fechar vídeo"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>
        <a
          className="button button-gold welcome-video-cta"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          Entrar na mentoria <Icon name="arrow" />
        </a>
      </div>
    </dialog>
  );
}
