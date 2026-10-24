"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Trượt qua bản nối ở hai đầu, rồi đổi về vị trí thật khi hình ảnh đã khớp. */
export function useLoopCarousel(count: number, duration: number) {
  const [state, setState] = useState({ position: 1, animate: false });
  const moving = useRef(false);
  const position = count > 0 ? Math.min(state.position, count + 1) : 1;
  const activeIndex = count > 0 ? (position - 1 + count) % count : 0;

  const settle = useCallback(() => {
    moving.current = false;
    setState(current => {
      if (current.position === 0) return { position: count, animate: false };
      if (current.position >= count + 1) return { position: 1, animate: false };
      return current;
    });
  }, [count]);

  useEffect(() => {
    if (!state.animate) return;
    // Dự phòng khi trình duyệt ngắt transition (đổi kích thước/ẩn tab).
    const timer = window.setTimeout(settle, duration + 80);
    return () => window.clearTimeout(timer);
  }, [state, duration, settle]);

  function goTo(index: number) {
    if (count <= 1 || moving.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState({ position: ((index + count) % count) + 1, animate: false });
      return;
    }
    moving.current = true;
    setState({ position: index + 1, animate: true });
  }

  return {
    position,
    activeIndex,
    animate: state.animate,
    next: () => goTo(activeIndex + 1),
    previous: () => goTo(activeIndex - 1),
    goTo,
    onTransitionEnd: (event: React.TransitionEvent<HTMLElement>) => {
      if (event.target === event.currentTarget && event.propertyName === "transform") settle();
    },
  };
}
