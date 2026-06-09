"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const REVEAL_SELECTOR =
  ".reveal-section, .reveal-from-left, .reveal-from-right, .stagger-list, .stagger-sides, .image-reveal";

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

function MotionRootInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const observed = new WeakSet<Element>();

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

    scan();

    const frame = requestAnimationFrame(() => {
      scan();
    });

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [routeKey]);

  return <div className="page-transition">{children}</div>;
}

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="page-transition">{children}</div>}>
      <MotionRootInner>{children}</MotionRootInner>
    </Suspense>
  );
}
