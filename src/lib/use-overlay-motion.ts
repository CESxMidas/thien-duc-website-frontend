"use client";

import { useEffect, useRef, useState } from "react";

export const OVERLAY_EXIT_MS = 180;
const reduceMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** Giữ lớp nổi tới hết nhịp đóng; phần đang đóng phải inert và aria-hidden. */
export function useOverlayPresence(open: boolean) {
  const [presence, setPresence] = useState({ open, mounted: open });
  if (presence.open !== open) {
    setPresence({ open, mounted: open || presence.mounted });
  }
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(
      () => setPresence((current) => ({ ...current, mounted: current.open })),
      reduceMotion() ? 0 : OVERLAY_EXIT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open]);
  return {
    mounted: presence.mounted,
    state: open ? ("open" as const) : ("closed" as const),
  };
}

/** Native dialog cần giữ top layer tới khi animation thoát kết thúc. */
export function useAnimatedClose(onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );
  function close() {
    if (timer.current !== null) return;
    if (reduceMotion()) {
      onClose();
      return;
    }
    setClosing(true);
    timer.current = window.setTimeout(onClose, OVERLAY_EXIT_MS);
  }
  return { closing, close };
}
