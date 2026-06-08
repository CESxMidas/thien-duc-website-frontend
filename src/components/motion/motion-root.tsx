"use client";

import { useEffect, type ReactNode } from "react";

const REVEAL_SELECTOR = ".reveal-section, .stagger-list, .image-reveal";

export function MotionRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    const scan = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (observed.has(element)) {
          return;
        }

        observed.add(element);
        observer.observe(element);
      });
    };

    scan();

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <div className="page-transition">{children}</div>;
}
