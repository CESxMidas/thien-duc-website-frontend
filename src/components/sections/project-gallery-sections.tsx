"use client";

import Image from "next/image";
import { Building2, ChevronLeft, ChevronRight, Hotel } from "lucide-react";
import { useState } from "react";
import type { ProjectGallerySection } from "@/types/content";

const AUTOPLAY_MS = 4500;

const sectionIcons: Record<string, typeof Hotel> = {
  "Khách sạn": Hotel,
  "Chung cư Fancy Tower": Building2,
};

type ProjectGallerySectionsProps = {
  sections: ProjectGallerySection[];
  projectTitle: string;
  /**
   * Nhãn đứng trên tiêu đề mỗi khối. Mặc định "Hạng mục" cho dự án có hạng mục
   * con; dự án chỉ có một thư viện ảnh chung thì truyền nhãn khác.
   */
  sectionLabel?: string;
};

function getGalleryGridClass(sectionCount: number) {
  if (sectionCount >= 4) {
    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
  }

  if (sectionCount === 3) {
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  }

  if (sectionCount === 2) {
    return "grid-cols-1 lg:grid-cols-2";
  }

  return "grid-cols-1";
}

function ProjectGallerySlider({
  section,
  projectTitle,
  sectionIndex,
  compact,
  sectionLabel,
  showIndex,
}: {
  section: ProjectGallerySection;
  projectTitle: string;
  sectionIndex: number;
  compact: boolean;
  sectionLabel: string;
  /** Chỉ đánh số khi có nhiều khối — "Thư viện 01" đứng một mình là vô nghĩa. */
  showIndex: boolean;
}) {
  const images = section.images;
  const imageCount = images.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = sectionIcons[section.title] ?? Building2;

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? imageCount - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % imageCount);
  }

  function goToSlide(slideIndex: number) {
    setActiveIndex(slideIndex);
  }

  function handleProgressEnd() {
    if (imageCount <= 1 || isPaused) {
      return;
    }

    goToNext();
  }

  return (
    <article
      className="project-gallery-card group hover-card overflow-hidden border border-brand/18 bg-white shadow-[0_12px_28px_rgba(127,75,13,0.1)]"
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovered(false);
      }}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className={`project-gallery-card-header relative overflow-hidden border-b border-brand/12 bg-gold-soft/45 ${
          compact ? "px-4 py-4" : "px-5 py-5 md:px-6"
        }`}
      >
        <div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-linear-to-b from-gold to-brand transition-transform duration-500 ease-out group-hover:scale-y-100" />
        <div className={`flex items-start ${compact ? "gap-3" : "gap-4"}`}>
          <span
            className={`project-gallery-icon grid shrink-0 place-items-center rounded-sm border border-brand/20 bg-white text-brand shadow-sm transition duration-500 group-hover:scale-105 group-hover:border-gold group-hover:bg-gold group-hover:text-ink ${
              compact ? "size-9" : "size-11"
            }`}
          >
            <Icon className={compact ? "size-4" : "size-5"} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            {!compact ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand transition duration-300 group-hover:tracking-[0.24em]">
                {sectionLabel}
                {showIndex ? ` ${String(sectionIndex + 1).padStart(2, "0")}` : ""}
              </p>
            ) : null}
            <h3
              className={`font-semibold text-ink transition duration-300 group-hover:translate-x-1 ${
                compact
                  ? "text-base leading-snug"
                  : "mt-1 text-lg md:text-xl"
              }`}
            >
              {section.title}
            </h3>
            {section.description && !compact ? (
              <p className="mt-2 text-sm leading-6 text-slate transition duration-300 group-hover:text-ink/80">
                {section.description}
              </p>
            ) : null}
          </div>
          {imageCount > 1 && !compact ? (
            <p className="hidden text-sm font-semibold text-brand/70 transition duration-300 group-hover:text-brand sm:block">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="mx-1 text-brand/35">/</span>
              {String(imageCount).padStart(2, "0")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="project-gallery-stage relative aspect-16/10 bg-surface">
        {images.map((image, slideIndex) => {
          const isActive = slideIndex === activeIndex;

          return (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={image}
                alt={`${projectTitle} - ${section.title} - hình ${slideIndex + 1}`}
                fill
                sizes={
                  compact
                    ? "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    : "(max-width: 1024px) 100vw, 50vw"
                }
                className={`object-cover transition duration-5200ms ease-out ${
                  isActive
                    ? isHovered
                      ? "scale-[1.08]"
                      : imageCount > 1
                        ? "scale-105"
                        : "project-gallery-ken-burns"
                    : "scale-100"
                }`}
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(25,25,25,0.05)_0%,rgba(25,25,25,0)_38%,rgba(25,25,25,0.42)_100%)] opacity-80 transition duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(253,205,4,0.22),transparent_34%)] opacity-0 transition duration-500 group-hover:opacity-100" />

        {imageCount > 1 ? (
          <>
            <div className="absolute inset-x-0 top-0 z-30 h-1 bg-brand/15">
              {!isPaused ? (
                <div
                  key={activeIndex}
                  className="banner-progress h-full bg-gold"
                  onAnimationEnd={handleProgressEnd}
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              ) : (
                <div
                  className="h-full bg-gold transition-transform duration-300"
                  style={{
                    transform: `scaleX(${(activeIndex + 1) / imageCount})`,
                    transformOrigin: "left",
                  }}
                />
              )}
            </div>

            <div
              className={`absolute z-30 flex items-center gap-1.5 transition duration-300 ${
                compact ? "bottom-3 right-3" : "bottom-4 right-4 gap-2"
              } ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0 sm:opacity-100"
              }`}
            >
              <button
                type="button"
                aria-label={`Ảnh trước — ${section.title}`}
                onClick={goToPrevious}
                className={`button-polish grid place-items-center border border-white/50 bg-ink/35 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink ${
                  compact ? "size-8" : "size-10"
                }`}
              >
                <ChevronLeft className={compact ? "size-3.5" : "size-4"} />
              </button>
              <button
                type="button"
                aria-label={`Ảnh tiếp theo — ${section.title}`}
                onClick={goToNext}
                className={`button-polish grid place-items-center border border-white/50 bg-ink/35 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink ${
                  compact ? "size-8" : "size-10"
                }`}
              >
                <ChevronRight className={compact ? "size-3.5" : "size-4"} />
              </button>
            </div>

            {!compact ? (
              <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-ink/25 px-3 py-2 backdrop-blur transition duration-300 group-hover:bg-ink/40">
                {images.map((image, slideIndex) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Chuyển tới ảnh ${slideIndex + 1} — ${section.title}`}
                    aria-current={slideIndex === activeIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      slideIndex === activeIndex
                        ? "w-7 bg-gold"
                        : "w-2 bg-white/70 hover:w-3 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="absolute bottom-3 left-3 z-30 rounded-sm border border-white/25 bg-ink/35 px-2 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">
                {String(activeIndex + 1).padStart(2, "0")}/{String(imageCount).padStart(2, "0")}
              </div>
            )}
          </>
        ) : (
          <div className="absolute bottom-4 left-5 z-30 rounded-sm border border-white/25 bg-ink/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur transition duration-300 group-hover:border-gold/60 group-hover:bg-ink/45">
            {section.title}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProjectGallerySections({
  sections,
  projectTitle,
  sectionLabel = "Hạng mục",
}: ProjectGallerySectionsProps) {
  const visibleSections = sections.filter((section) => section.images.length > 0);
  const sectionCount = visibleSections.length;
  const compact = sectionCount >= 4;

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div
      className={`stagger-sides grid gap-4 xl:gap-5 ${getGalleryGridClass(sectionCount)}`}
    >
      {visibleSections.map((section, sectionIndex) => (
        <ProjectGallerySlider
          key={section.title}
          section={section}
          projectTitle={projectTitle}
          sectionIndex={sectionIndex}
          compact={compact}
          sectionLabel={sectionLabel}
          showIndex={sectionCount > 1}
        />
      ))}
    </div>
  );
}
