"use client";

import { useEffect } from "react";

export function Enhancements() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const intro = document.querySelector<HTMLDialogElement>(".site-intro");
    let observer: IntersectionObserver | undefined;

    function reset() {
      observer?.disconnect();
      observer = undefined;
      document.querySelectorAll(".reveal-pending").forEach((el) => {
        el.classList.remove("reveal-pending");
      });
      document.querySelectorAll<HTMLElement>("[data-text-reveal]").forEach((el) => {
        delete el.dataset.textState;
      });
    }

    function start() {
      if (preference.matches || intro?.open || observer) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            if (target.hasAttribute("data-text-reveal")) {
              target.dataset.textState = "visible";
            } else {
              target.classList.remove("reveal-pending");
            }
            observer?.unobserve(target);
          });
        },
        { threshold: 0.08 },
      );
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add("reveal-pending");
          observer?.observe(el);
        }
      });
      document.querySelectorAll<HTMLElement>("[data-text-reveal]").forEach((el) => {
        el.dataset.textState = "pending";
        observer?.observe(el);
      });
    }

    function preferenceChanged() {
      reset();
      start();
    }

    // Start the hero's word animation after the opening, so it is actually seen.
    const frame = requestAnimationFrame(start);
    intro?.addEventListener("close", start);
    preference.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      intro?.removeEventListener("close", start);
      preference.removeEventListener("change", preferenceChanged);
      reset();
    };
  }, []);
  return null;
}
