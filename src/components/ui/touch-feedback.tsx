"use client";

import type { PointerEvent, ReactNode } from "react";

export function TouchFeedback({ children }: { children: ReactNode }) {
  function release(event: PointerEvent<HTMLDivElement>) {
    delete event.currentTarget.dataset.pressed;
  }

  return (
    <div
      className="about-touch-feedback contents"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse") return;
        event.currentTarget.dataset.pressed = "true";
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {children}
    </div>
  );
}
