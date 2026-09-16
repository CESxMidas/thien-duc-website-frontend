"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR =
  ".reveal-section, .reveal-from-left, .reveal-from-right, .stagger-list, .stagger-sides, .image-reveal";

// Lần tải trang đầu tiên KHÔNG chạy fade `page-transition`: animation bắt đầu ở
// opacity 0 nên first paint vô hình → Lighthouse/PSI có thể không ghi nhận được
// FCP/LCP (đã tái lập NO_FCP chập chờn trên production, xem
// docs/06-testing/g4-measurement-baseline.md). Template remount MotionRoot mỗi
// lần điều hướng nên cờ phải nằm ở module scope (chỉ set trong effect — không
// chạy lúc SSR, không gây hydration mismatch: server và first client render đều
// không có class, các lần điều hướng client-side sau đó mới có).
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

  // Đọc cờ NGAY lúc render (trước effect): instance đầu tiên thấy `false` →
  // không fade; instance của các lần điều hướng sau thấy `true` → fade như cũ.
  const isClientNavigation = hasCompletedInitialLoad;

  useLayoutEffect(() => {
    hasCompletedInitialLoad = true;
  }, []);

  // Scroll về đầu trang khi route thay đổi
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Gắn class reveal sau khi hydration hoàn tất. Dùng useLayoutEffect ở đây sẽ
  // sửa className trong lúc React còn đối chiếu HTML server và phát cảnh báo
  // hydration mismatch trên các trang có stagger-list/image-reveal.
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

    // Next/React có thể hydrate từng Suspense boundary sau khi effect của wrapper
    // đã chạy. Trì hoãn lần quét đầu để không sửa className bên trong boundary
    // khi React vẫn đang đối chiếu HTML server.
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
