"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/types/content";
import { trackTransform } from "@/components/sections/news-slider";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

/**
 * Số thẻ nhìn thấy cùng lúc theo khung nhìn. Ngưỡng trùng `md`/`lg` của Tailwind
 * để phép tính JS và bề rộng thẻ không bao giờ lệch nhau — cùng quy ước với
 * `NewsSlider`.
 */
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

/** Khoảng cách giữa hai thẻ, tính bằng px — bằng `gap-5` của Tailwind. */
const GAP_PX = 20;

function visibleCountFor(width: number): number {
  if (width >= BREAKPOINT_DESKTOP) return 3;
  if (width >= BREAKPOINT_TABLET) return 2;
  return 1;
}

type ProjectsCarouselProps = {
  projects: Project[];
  locale: Locale;
  /** Nhãn do server truyền xuống — client component không nạp dictionary async được. */
  labels: Dictionary["projects"]["carousel"];
  statusLabels: Dictionary["projectStatus"];
  detailLabel: string;
};

/**
 * Danh sách dự án dạng slider: 3 thẻ/lần trên desktop, 2 trên tablet, 1 trên
 * mobile, trượt **một thẻ** mỗi lần bấm.
 *
 * **Có giới hạn hai đầu, không lặp vòng và không nhân bản thẻ.** Mỗi dự án xuất
 * hiện đúng một lần trong DOM. Thẻ cuối dừng sát mép phải, hết dải thì nút mờ đi
 * — người dùng biết mình đã xem hết thay vì bị đẩy ngược về đầu (cú nhảy đó
 * trông rất nghiệp dư) hay phải đoán xem còn nữa không.
 *
 * **Không autoplay**: thẻ dự án có mô tả 2–3 dòng để đọc.
 *
 * Dùng lại `trackTransform` của `NewsSlider` — hàm đó có bẫy cú pháp `calc()`
 * (dấu trừ phải nằm TRONG `calc`, không được viết `translateX(-calc(...))`) đã
 * được test khoá lại; viết lại là tự chuốc lỗi cũ.
 */
export function ProjectsCarousel({
  projects,
  locale,
  labels,
  statusLabels,
  detailLabel,
}: ProjectsCarouselProps) {
  const count = projects.length;
  const [rawActiveIndex, setActiveIndex] = useState(0);
  // Giá trị đầu phải GIỐNG NHAU ở server và lần render đầu phía client, nếu
  // không sẽ lệch hydration. Lần render đầu luôn ở `activeIndex = 0` nên
  // transform là 0 bất kể `visibleCount`.
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Chỉ số lớn nhất để thẻ cuối dừng đúng mép phải, không trượt vào khoảng
  // trống. Ít thẻ hơn số ô nhìn thấy → không trượt được (maxIndex = 0).
  const maxIndex = Math.max(0, count - visibleCount);
  // Mở rộng khung nhìn làm `maxIndex` nhỏ đi, nên chỉ số đang giữ có thể vượt
  // giới hạn mới. Kẹp lại **khi render** thay vì bằng effect gọi setState —
  // đây là giá trị dẫn xuất, không phải trạng thái cần đồng bộ.
  const activeIndex = Math.min(rawActiveIndex, maxIndex);

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;
  const isInteractive = maxIndex > 0;
  /** Số vị trí trượt được, kể cả vị trí đầu. */
  const positionCount = maxIndex + 1;

  function goToPrevious() {
    setActiveIndex(Math.max(0, activeIndex - 1));
  }

  function goToNext() {
    setActiveIndex(Math.min(maxIndex, activeIndex + 1));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  const trackGaps = (visibleCount - 1) * GAP_PX;
  const slideWidth = `calc((100% - ${trackGaps}px) / ${visibleCount})`;

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.regionLabel}
      onKeyDown={handleKeyDown}
    >
      <div className="overflow-hidden">
        <ul
          data-testid="projects-carousel-track"
          data-index={activeIndex}
          className="flex list-none gap-5 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: trackTransform(activeIndex, visibleCount, GAP_PX) }}
        >
          {projects.map((project, position) => {
            // Thẻ ngoài cửa sổ đang hiện bị gỡ khỏi thứ tự Tab và khỏi trình đọc
            // màn hình — nếu không, Tab sẽ nhảy vào thẻ khuất bên phải.
            const isVisible =
              position >= activeIndex && position < activeIndex + visibleCount;

            return (
              <li
                key={project.slug}
                data-testid="projects-carousel-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <Link
                  href={localizePath(
                    `${routes.projects}/${project.slug}`,
                    locale,
                  )}
                  tabIndex={isVisible ? undefined : -1}
                  className="hover-card group flex h-full flex-col overflow-hidden border border-black/10 bg-white hover:border-brand"
                >
                  {project.image ? (
                    <div className="image-reveal relative aspect-3/2 overflow-hidden bg-surface">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {project.location ? <span>{project.location}</span> : null}
                      {project.location ? (
                        <span className="h-1 w-1 rounded-full bg-gold" />
                      ) : null}
                      <span>{statusLabels[project.status]}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold leading-tight">
                      {project.title}
                    </h2>
                    {project.category ? (
                      <p className="mt-2 text-sm font-semibold text-slate">
                        {project.category}
                      </p>
                    ) : null}
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate">
                      {project.summary}
                    </p>
                    {/* `mt-auto` ghim nút xuống đáy: các thẻ trong một khung
                        trượt cao bằng nhau, mô tả dài ngắn khác nhau sẽ khiến
                        nút nhảy lên xuống nếu để trôi theo nội dung. */}
                    <span className="link-arrow mt-auto inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
                      {detailLabel}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isInteractive ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          {/* Một chấm cho một VỊ TRÍ TRƯỢT (không phải cho một dự án): slider có
              giới hạn nên số vị trí luôn nhỏ hơn số thẻ. */}
          <div className="flex items-center gap-2">
            {Array.from({ length: positionCount }, (_, position) => (
              <button
                key={position}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(position + 1),
                })}
                aria-current={position === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(position)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  position === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="projects-carousel-previous"
              aria-label={labels.ariaPrevious}
              disabled={!canGoPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/25 disabled:hover:bg-white disabled:hover:text-brand"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="projects-carousel-next"
              aria-label={labels.ariaNext}
              disabled={!canGoNext}
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/25 disabled:hover:bg-white disabled:hover:text-brand"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {interpolate(labels.status, {
          current: String(activeIndex + 1),
          total: String(positionCount),
        })}
      </p>
    </div>
  );
}
