"use client";

import { useEffect, useRef } from "react";

export function useMagnetic() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
    const supportsTranslate = window.CSS?.supports?.("translate", "1px 1px") ?? false;

    if (prefersReduced || !canHover || !supportsTranslate) return;

    const max = 12;
    const strength = 0.22;
    let raf = 0;
    let nextX = 0;
    let nextY = 0;

    const clamp = (v, min, maxV) => Math.max(min, Math.min(maxV, v));

    const commit = () => {
      raf = 0;
      el.style.setProperty("--mx", `${nextX}px`);
      el.style.setProperty("--my", `${nextY}px`);
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);

      nextX = clamp(dx * strength, -max, max);
      nextY = clamp(dy * strength, -max, max);

      if (raf) return;
      raf = requestAnimationFrame(commit);
    };

    const reset = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      nextX = 0;
      nextY = 0;
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointerdown", reset);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointerdown", reset);
    };
  }, []);

  return ref;
}
