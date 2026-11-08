"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  poster: string;
  title: string;
  caption: string;
  animatedBorder?: boolean;
};

export function VideoPlayer({
  src,
  poster,
  title,
  caption,
  animatedBorder = false,
}: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <figure className="video-player">
      <div className={`video-frame${animatedBorder ? " video-frame-animated" : ""}`}>
        <video
          ref={video}
          controls
          playsInline
          preload="none"
          poster={poster}
          width={1080}
          height={1920}
          aria-label={title}
          onPlay={() => setStarted(true)}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não oferece reprodução de vídeo.
          <a href={src}>Abrir {title}</a>.
        </video>
        {!started && (
          <button
            className="video-cover"
            type="button"
            style={{ backgroundImage: `url("${poster}")` }}
            aria-label={`Assistir ao vídeo: ${title}`}
            onClick={() => {
              setStarted(true);
              video.current?.focus();
              void video.current?.play().catch(() => video.current?.focus());
            }}
          >
            <span className="video-cover-action">
              <span className="video-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>Assistir ao vídeo</span>
            </span>
          </button>
        )}
      </div>
      <noscript>
        <style>{".video-cover{display:none!important}"}</style>
      </noscript>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
