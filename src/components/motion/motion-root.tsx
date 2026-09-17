"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR =
  ".reveal-section, .reveal-from-left, .reveal-from-right, .stagger-list, .stagger-sides, .image-reveal";

let hasCompletedInitialLoad = false;

function isInRevealViewport(element: Element) {
  const rect = element.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  const viewportBottom = window.innerHeight * 0.95;

  return rect.top < viewportBottom && rect.bottom > 0;
}

function revealElement(element: Element, observer: IntersectionObserver) {
  element.classList.add("is-revealed");
  observer.unobserve(element);
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isClientNavigation = hasCompletedInitialLoad;

  useLayoutEffect(() => {
    hasCompletedInitialLoad = true;
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const observed = new WeakSet<Element>();
    let mutationObserver: MutationObserver | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealElement(entry.target, observer);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    const scan = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (element.classList.contains("is-revealed")) {
          return;
        }

        if (observed.has(element)) {
          if (isInRevealViewport(element)) {
            revealElement(element, observer);
          }
          return;
        }

        observed.add(element);

        if (isInRevealViewport(element)) {
          revealElement(element, observer);
          return;
        }

        observer.observe(element);
      });
    };

    const start = () => {
      scan();
      mutationObserver = new MutationObserver(scan);
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    };
    const startTimeout = window.setTimeout(start, 600);

    return () => {
      window.clearTimeout(startTimeout);
      observer.disconnect();
      mutationObserver?.disconnect();
    };
  }, [pathname]);

  return (
    <div className={isClientNavigation ? "page-transition" : undefined}>
      {children}
    </div>
  );
}
