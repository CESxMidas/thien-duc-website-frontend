"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { NewsPost } from "@/types/content";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

/**
 * Số thẻ nhìn thấy cùng lúc theo khung nhìn. Ngưỡng khớp `md`/`lg` của Tailwind
 * để lớp CSS (`md:w-1/2 lg:w-1/3`) và phép tính JS không bao giờ lệch nhau.
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

/**
 * Giá trị `transform` dịch track sang trái `activeIndex` bước.
 *
 * Viết thành **một** biểu thức `calc()` phẳng và **tự mang dấu âm**.
 *
 * KHÔNG được viết `translateX(-calc(...))`: dấu trừ đặt ngay trước `calc()` là
 * cú pháp CSS không hợp lệ, trình duyệt bỏ nguyên khai báo `transform` — nút bấm
 * vẫn đổi state, chấm vẫn sáng, mà thẻ đứng im. Đây từng là lỗi thật; test
 * `news-slider-transform.test.ts` khoá lại.
 *
 * Phần trăm tính theo bề rộng của chính track, mà track rộng đúng bằng khung
 * chứa, nên phép tính khớp với bề rộng thẻ.
 */
export function trackTransform(
  activeIndex: number,
  visibleCount: number,
  gapPx: number = GAP_PX,
): string {
  if (activeIndex <= 0) return "translateX(0px)";

  const trackGaps = (visibleCount - 1) * gapPx;
  return `translateX(calc(${-activeIndex} * (100% - ${trackGaps}px) / ${visibleCount} - ${
    activeIndex * gapPx
  }px))`;
}

type NewsSliderProps = {
  posts: NewsPost[];
  locale: Locale;
  /** Nhãn do server truyền xuống — client component không nạp dictionary async được. */
  labels: Dictionary["newsSlider"];
  detailLabel: string;
};

/**
 * Slider tin mới ở trang chủ: 3 thẻ/lần trên desktop, 2 trên tablet, 1 trên
 * mobile, trượt **một thẻ** mỗi lần bấm.
 *
 * Tự viết theo đúng pattern `ProjectItemsCarousel` đang dùng trong dự án (state
 * chỉ số + `translateX`), không thêm thư viện carousel nào.
 *
 * **Không autoplay**, khác các slider khác của site: khối này là điểm điều
 * hướng chứ không phải banner, và tin tự trôi khiến người đọc mất bài đang xem.
 * Bỏ autoplay cũng khiến test e2e tất định mà không cần chế độ test riêng.
 */
export function NewsSlider({
  posts,
  locale,
  labels,
  detailLabel,
}: NewsSliderProps) {
  const count = posts.length;
  const [rawActiveIndex, setActiveIndex] = useState(0);
  // Giá trị đầu phải GIỐNG NHAU ở server và lần render đầu phía client, nếu
  // không sẽ lệch hydration. Lần render đầu luôn ở `activeIndex = 0` nên
  // transform là 0 bất kể `visibleCount`; hiệu ứng bên dưới chỉnh lại ngay sau
  // khi gắn vào DOM.
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Chỉ số lớn nhất để thẻ cuối cùng dừng đúng mép phải, không trượt vào khoảng
  // trống. Ít thẻ hơn số ô nhìn thấy → không trượt được (maxIndex = 0).
  const maxIndex = Math.max(0, count - visibleCount);

  // Mở rộng khung nhìn làm `maxIndex` nhỏ đi, nên chỉ số đang giữ có thể vượt
  // giới hạn mới. Kẹp lại **khi render** thay vì bằng một effect gọi setState —
  // đây là giá trị dẫn xuất, không phải trạng thái cần đồng bộ.
  const activeIndex = Math.min(rawActiveIndex, maxIndex);

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;
  const isInteractive = maxIndex > 0;

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

  // Mỗi thẻ rộng `(100% - tổng gap) / số ô`; bước trượt = bề rộng thẻ + một gap.
  const trackGaps = (visibleCount - 1) * GAP_PX;
  const slideWidth = `calc((100% - ${trackGaps}px) / ${visibleCount})`;
  const transform = trackTransform(activeIndex, visibleCount);

  return (
    <div
      className="relative mt-10"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.regionLabel}
      onKeyDown={handleKeyDown}
    >
      <div className="overflow-hidden">
        <ul
          data-testid="news-slider-track"
          className="flex list-none gap-5 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform }}
        >
          {posts.map((post, index) => {
            // Thẻ nằm ngoài cửa sổ đang hiện bị ẩn khỏi thứ tự Tab và khỏi trình
            // đọc màn hình — nếu không, Tab sẽ nhảy vào thẻ khuất bên phải.
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;

            return (
              <li
                key={post.slug}
                data-testid="news-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <Link
                  href={localizePath(`${routes.news}/${post.slug}`, locale)}
                  tabIndex={isVisible ? undefined : -1}
                  className="hover-card group flex h-full flex-col border border-brand/10 bg-white shadow-[0_10px_28px_rgba(25,25,25,0.05)] hover:border-brand"
                >
                  {post.image ? (
                    <div className="image-reveal relative aspect-video overflow-hidden bg-surface">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm text-slate">
                      {formatDate(post.publishedAt, locale)}
                    </p>
                    <h3 className="mt-3 line-clamp-3 text-xl font-semibold">
                      {post.title}
                    </h3>
                    <span className="link-arrow mt-auto pt-5 text-sm font-semibold text-brand">
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
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(index + 1),
                })}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="news-slider-previous"
              aria-label={labels.ariaPrevious}
              disabled={!canGoPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/25 disabled:hover:bg-white disabled:hover:text-brand"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="news-slider-next"
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

      {/* Thông báo vị trí cho trình đọc màn hình; không hiện trên màn hình. */}
      <p aria-live="polite" className="sr-only">
        {interpolate(labels.status, {
          current: String(activeIndex + 1),
          total: String(count),
        })}
      </p>
    </div>
  );
}
