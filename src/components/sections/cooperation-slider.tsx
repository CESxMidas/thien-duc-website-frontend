"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import type { CooperationProject } from "@/data/home";
import { homeCooperationIntro } from "@/data/home";

const AUTOPLAY_MS = 5200;

/**
 * Dự án hợp tác — slider một hàng ngang tự chạy. Dùng scroll-snap để hiển thị
 * nhiều thẻ trên cùng một hàng (mobile lộ mép thẻ kế tiếp gợi ý vuốt, desktop
 * xếp cạnh nhau). Tự chạy tôn trọng `prefers-reduced-motion` và tạm dừng khi
 * hover/focus. Không mượn ảnh — mỗi thẻ là một tấm nền thương hiệu đối tác.
 * Dữ liệu do server truyền vào (từ API `/cooperation`, fallback mock tĩnh).
 */
export function CooperationSlider({
  projects,
}: {
  projects: CooperationProject[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = projects.length;
  const canSlide = count > 1;

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const clamped = (index + count) % count;
      const child = track.children[clamped] as HTMLElement | undefined;
      if (child) {
        track.scrollTo({
          left: child.offsetLeft - track.offsetLeft,
          behavior: "smooth",
        });
      }
    },
    [count],
  );

  // Cập nhật chấm chỉ báo theo thẻ đang gần mép trái nhất khi người dùng vuốt.
  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;

    const children = Array.from(track.children) as HTMLElement[];
    const nearest = children.reduce(
      (best, child, index) => {
        const distance = Math.abs(
          child.offsetLeft - track.offsetLeft - track.scrollLeft,
        );
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Infinity },
    );
    setActiveIndex(nearest.index);
  }

  useEffect(() => {
    if (!canSlide || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, canSlide, isPaused, scrollToIndex]);

  return (
    <section className="reveal-section bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              {homeCooperationIntro.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              {homeCooperationIntro.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate sm:mt-5 sm:text-lg sm:leading-8">
              {homeCooperationIntro.description}
            </p>
          </div>

          {canSlide ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Dự án hợp tác trước"
                onClick={() => scrollToIndex(activeIndex - 1)}
                className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Dự án hợp tác tiếp theo"
                onClick={() => scrollToIndex(activeIndex + 1)}
                className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="stagger-list no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 justify-center px-4 sm:px-6 md:px-0 md:justify-start"
        >
          {projects.map((project) => (
            <article
              key={project.name}
              className="hover-card group relative flex w-[88%] shrink-0 snap-start flex-col justify-between overflow-hidden bg-brand-dark p-5 text-white sm:w-[70%] sm:p-6 md:w-[calc(50%-0.625rem)] md:p-8"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(253,205,4,0.18),transparent_46%)]"
                aria-hidden="true"
              />
              <Building2
                className="pointer-events-none absolute -bottom-8 -right-6 size-44 text-white/6 transition-transform duration-500 group-hover:scale-105"
                aria-hidden="true"
              />

              {project.image ? (
                <div
                  role="img"
                  aria-label={`Ảnh phối cảnh ${project.name}`}
                  style={{ backgroundImage: `url(${project.image})` }}
                  className="relative -mx-6 -mt-6 mb-6 h-44 bg-cover bg-center md:-mx-8 md:-mt-8 md:h-52"
                >
                  {/* Chuyển màu về nền thẻ để chữ phía dưới luôn đọc rõ. */}
                  <div
                    className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/30 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              ) : null}

              {/* Khối chữ kẹp số dòng (line-clamp) để nội dung dài không kéo
                  giãn thẻ — mọi thẻ giữ đúng một khung, rê chuột đọc toàn văn. */}
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                  <Handshake className="size-4" aria-hidden="true" />
                  Hợp tác phát triển
                </p>
                <h3
                  className="mt-4 line-clamp-1 text-2xl font-semibold leading-tight md:text-3xl"
                  title={project.name}
                >
                  {project.name}
                </h3>
                {/* Cố định 2 dòng (min-h theo line-height) — thẻ có mô tả 1
                    dòng hay 2 dòng đều cao bằng nhau. */}
                <p
                  className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-white/70"
                  title={`${project.location} · ${project.scale}`}
                >
                  {project.location} · {project.scale}
                </p>
              </div>

              <dl className="relative mt-8 grid gap-4 border-t border-white/15 pt-6 text-sm sm:grid-cols-3">
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Vai trò
                  </dt>
                  <dd
                    className="mt-1 line-clamp-2 font-semibold"
                    title={project.role}
                  >
                    {project.role}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Đối tác
                  </dt>
                  <dd
                    className="mt-1 line-clamp-2 font-semibold"
                    title={project.partner}
                  >
                    {project.partner}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Trạng thái
                  </dt>
                  <dd
                    className="mt-1 line-clamp-2 font-semibold"
                    title={project.status}
                  >
                    {project.status}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {canSlide ? (
          <div className="mt-6 flex items-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.name}
                type="button"
                aria-label={`Chuyển tới dự án ${project.name}`}
                aria-current={index === activeIndex}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
