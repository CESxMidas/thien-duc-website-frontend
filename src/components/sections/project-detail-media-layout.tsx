"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type ProjectDetailMediaLayoutProps = {
  gallery: ReactNode;
  children: ReactNode;
};

export function ProjectDetailMediaLayout({
  gallery,
  children,
}: ProjectDetailMediaLayoutProps) {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [galleryHeight, setGalleryHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = galleryRef.current;
    if (!node) return;
    const observedNode = node;

    function updateHeight() {
      const nextHeight = Math.ceil(observedNode.getBoundingClientRect().height);
      setGalleryHeight((current) =>
        current === nextHeight ? current : nextHeight,
      );
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(observedNode);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      className="page-container reveal-sides-pair grid gap-6 lg:grid-cols-[minmax(16rem,0.58fr)_minmax(26rem,1fr)] lg:items-start"
      style={
        galleryHeight
          ? ({ "--project-media-height": `${galleryHeight}px` } as CSSProperties)
          : undefined
      }
    >
      <div
        ref={galleryRef}
        className="image-reveal min-w-0 max-w-full"
      >
        {gallery}
      </div>

      <article className="project-detail-overview-panel reveal-from-right hover-card project-detail-panel-accent relative flex flex-col overflow-hidden border-l-4 border-l-gold p-5 md:p-7">
        <div className="project-detail-overview-scroll grid gap-6">
          {children}
        </div>
      </article>
    </div>
  );
}
