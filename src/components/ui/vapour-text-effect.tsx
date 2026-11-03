"use client";

/** Adapted from the canvas vapour-text-effect supplied in the client's brief.
 * Retains text pixel sampling, a directional vaporization wave and particle drift.
 * Adds a bounded one-shot mode, reduced motion, capped DPR and complete cleanup.
 */
import { createElement, useEffect, useRef, useState } from "react";

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}
type Props = {
  texts: string[];
  font?: { fontFamily?: string; fontSize?: string; fontWeight?: number };
  color?: string;
  spread?: number;
  density?: number;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
  once?: boolean;
  onComplete?: () => void;
};
type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  alpha: number;
  velocityX: number;
  velocityY: number;
  startedAt: number | null;
};

export default function VaporizeTextCycle({
  texts,
  font,
  color = "rgb(228,200,140)",
  spread = 5,
  density = 5,
  animation,
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
  once = false,
  onComplete,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeRef = useRef(onComplete);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const text = texts[index] ?? texts[0] ?? "";
  const family = font?.fontFamily;
  const size = parseFloat(font?.fontSize ?? "76");
  const weight = font?.fontWeight ?? 550;
  const fadeDuration = Math.max(
    100,
    (animation?.fadeInDuration ?? 0.35) * 1000,
  );
  const waitDuration = Math.max(0, (animation?.waitDuration ?? 0.5) * 1000);
  const vaporDuration = Math.max(
    300,
    (animation?.vaporizeDuration ?? 1.35) * 1000,
  );
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrapper || !canvas || !ctx) {
      completeRef.current?.();
      return;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let completed = false;
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let inView = true;
    let width = 0;
    let height = 0;
    let left = 0;
    let textWidth = 0;
    let particles: Particle[] = [];
    const tailDuration = Math.min(550, vaporDuration * 0.4);
    const vaporStart = fadeDuration + waitDuration;
    const totalDuration = vaporStart + vaporDuration + tailDuration;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
    function finish() {
      if (completed || disposed) return;
      completed = true;
      stop();
      if (once) completeRef.current?.();
      else setIndex((value) => (value + 1) % Math.max(1, texts.length));
    }
    function render(now: number) {
      frame = 0;
      if (
        disposed ||
        completed ||
        document.hidden ||
        !inView ||
        preference.matches ||
        !particles.length
      )
        return;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.04) : 0;
      lastTime = now;
      elapsed += delta * 1000;
      ctx!.clearRect(0, 0, width, height);
      const fade = Math.min(1, elapsed / fadeDuration);
      const progress = Math.max(
        0,
        Math.min(1, (elapsed - vaporStart) / vaporDuration),
      );
      const front =
        direction === "left-to-right"
          ? left + textWidth * progress
          : left + textWidth * (1 - progress);
      // Keep the intact letters sharp; only the dissolving portion is particles.
      ctx!.save();
      ctx!.globalAlpha = fade;
      ctx!.beginPath();
      if (direction === 'left-to-right') ctx!.rect(front, 0, width - front, height);
      else ctx!.rect(0, 0, front, height);
      ctx!.clip();
      ctx!.fillText(text, left, height / 2);
      ctx!.restore();
      for (const particle of particles) {
        let alpha = particle.alpha * fade;
        const reached =
          elapsed >= vaporStart &&
          (direction === "left-to-right"
            ? particle.originalX <= front
            : particle.originalX >= front);
        if (reached) {
          if (particle.startedAt === null) particle.startedAt = elapsed;
          const age = elapsed - particle.startedAt;
          particle.x += particle.velocityX * delta;
          particle.y += particle.velocityY * delta;
          particle.velocityY -= delta * 12;
          alpha *= Math.max(0, 1 - age / tailDuration);
        }
        else continue;
        if (alpha <= 0.005) continue;
        ctx!.globalAlpha = alpha;
        ctx!.fillRect(particle.x, particle.y, 2, 2);
      }
      ctx!.globalAlpha = 1;
      if (elapsed >= totalDuration) {
        finish();
        return;
      }
      frame = requestAnimationFrame(render);
    }
    function start() {
      if (
        !frame &&
        !disposed &&
        !completed &&
        !document.hidden &&
        inView &&
        !preference.matches &&
        particles.length
      ) {
        lastTime = 0;
        frame = requestAnimationFrame(render);
      }
    }
    function build() {
      if (disposed || completed || preference.matches) return;
      width = Math.round(wrapper!.clientWidth);
      height = Math.round(wrapper!.clientHeight);
      if (!width || !height) return;
      stop();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample = document.createElement("canvas");
      sample.width = width;
      sample.height = height;
      const buffer = sample.getContext("2d", { willReadFrequently: true });
      if (!buffer) {
        finish();
        return;
      }
      const fontFamily = family || getComputedStyle(wrapper!).fontFamily;
      let fontSize = Math.min(size, height * 0.55);
      buffer.font = `${weight} ${fontSize}px ${fontFamily}`;
      const measured = buffer.measureText(text).width;
      fontSize *= Math.min(1, (width - 36) / Math.max(1, measured));
      buffer.font = `${weight} ${fontSize}px ${fontFamily}`;
      textWidth = buffer.measureText(text).width;
      left =
        alignment === "left"
          ? 18
          : alignment === "right"
            ? width - textWidth - 18
            : (width - textWidth) / 2;
      buffer.fillStyle = color;
      buffer.textBaseline = "middle";
      buffer.fillText(text, left, height / 2);
      ctx!.font = buffer.font;
      ctx!.textBaseline = 'middle';
      const pixels = buffer.getImageData(0, 0, width, height).data;
      particles = [];
      const step = density > 7 ? 1 : 2;
      const strength = Math.max(1, spread) / 5;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = pixels[(y * width + x) * 4 + 3] / 255;
          if (alpha < 0.15) continue;
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            alpha,
            velocityX:
              ((direction === "left-to-right" ? 1 : -1) * 16 +
                (Math.random() - 0.5) * 90) *
              strength,
            velocityY: -(12 + Math.random() * 65) * strength,
            startedAt: null,
          });
        }
      }
      if (particles.length > 9000)
        particles = particles.filter(
          (_, i) => i % Math.ceil(particles.length / 9000) === 0,
        );
      ctx!.fillStyle = color;
      elapsed = 0;
      setReady(true);
      start();
    }
    function preferenceChanged() {
      if (preference.matches) {
        stop();
        setReady(false);
        if (once) finish();
      } else build();
    }
    function visibilityChanged() {
      if (document.hidden) stop();
      else start();
    }
    preference.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    const resizeObserver = new ResizeObserver(() => {
      void document.fonts.ready.then(() => build());
    });
    resizeObserver.observe(wrapper);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    observer.observe(wrapper);
    if (preference.matches) preferenceChanged();
    else void document.fonts.ready.then(() => build());
    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      preference.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      particles = [];
      ctx.clearRect(0, 0, width, height);
    };
  }, [
    text,
    family,
    size,
    weight,
    color,
    spread,
    density,
    fadeDuration,
    waitDuration,
    vaporDuration,
    direction,
    alignment,
    once,
    texts.length,
  ]);

  return (
    <div ref={wrapperRef} className="vapour-text" data-canvas-ready={ready}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {createElement(tag, { className: "vapour-text-fallback" }, text)}
    </div>
  );
}
