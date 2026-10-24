"use client";

import { useEffect, useState, type FocusEvent } from "react";

export const CAROUSEL_AUTOPLAY_MS = 5200;
export const CAROUSEL_TRANSITION_MS = 700;
export const CAROUSEL_TRACK_CLASS =
  "transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform motion-reduce:transition-none";

export function useCarouselPlayback() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media?.matches ?? false);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion();
    syncVisibility();
    media?.addEventListener?.("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      media?.removeEventListener?.("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return {
    paused: hovered || focused || hidden,
    reducedMotion,
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      },
    },
  };
}
