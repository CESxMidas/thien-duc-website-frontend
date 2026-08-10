"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { trackTransform } from "@/components/sections/news-slider";

/**
 * Số thẻ nhìn thấy cùng lúc. Ngưỡng trùng `md`/`lg` của Tailwind để phép tính JS
 * và bề rộng thẻ không bao giờ lệch nhau — cùng quy ước với `NewsSlider`.
 */
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

/** Khoảng cách giữa hai thẻ, tính bằng px — bằng `gap-4` của Tailwind. */
const GAP_PX = 16;

function visibleCountFor(width: number): number {
  if (width >= BREAKPOINT_DESKTOP) return 3;
  if (width >= BREAKPOINT_TABLET) return 2;
  return 1;
}

type BusinessFieldsCarouselProps = {
  fields: Dictionary["about"]["fields"];
  codeLabel: string;
  /** Nhãn do server truyền xuống — client component không nạp dictionary async được. */
  labels: Dictionary["about"]["fieldsCarousel"];
};

/**
 * Slider ngành nghề kinh doanh: 3 thẻ/lần trên desktop, 2 trên tablet, 1 trên
 * mobile, trượt **một thẻ** mỗi lần bấm.
 *
 * Khác `NewsSlider` ở đúng một điểm: điều hướng **vòng tròn** — ở vị trí cuối
 * bấm tiếp quay về đầu, ở vị trí đầu bấm lùi nhảy xuống cuối. Vì thế hai nút
 * không bao giờ `disabled`. Đây là vòng lặp theo chỉ số (nhảy về đầu), không
 * phải băng chuyền vô tận nhân bản thẻ — ít mã hơn, không sinh key trùng, và
 * đúng với hành vi người dùng mong đợi ở một danh sách ngắn 6 mục.
 *
 * **Không autoplay**: đây là nội dung để đọc (mô tả ngành nghề dài 2–3 dòng),
 * tự trôi sẽ cắt ngang người đang đọc.
 */
export function BusinessFieldsCarousel({
  fields,
  codeLabel,
  labels,
}: BusinessFieldsCarouselProps) {
  const count = fields.length;
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

  const isInteractive = maxIndex > 0;
  /** Số vị trí trượt được (kể cả vị trí đầu). */
  const positionCount = maxIndex + 1;

  function goToPrevious() {
    setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1);
  }

  function goToNext() {
    setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1);
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
  const transform = trackTransform(activeIndex, visibleCount, GAP_PX);

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
          data-testid="business-fields-track"
          className="flex list-none gap-4 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform }}
        >
          {fields.map((item, index) => {
            // Thẻ ngoài cửa sổ đang hiện bị ẩn khỏi thứ tự Tab và khỏi trình đọc
            // màn hình — nếu không, Tab sẽ nhảy vào thẻ khuất bên phải.
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;

            return (
              <li
                key={item.title}
                data-testid="business-field-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <div className="h-full [&>article]:h-full">
                  <BusinessFieldCard
                    item={item}
                    index={index}
                    codeLabel={codeLabel}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {isInteractive ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: positionCount }, (_, index) => (
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

          {/* Không `disabled`: điều hướng vòng tròn nên hai nút luôn bấm được. */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="business-fields-previous"
              aria-label={labels.ariaPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="business-fields-next"
              aria-label={labels.ariaNext}
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
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
          total: String(positionCount),
        })}
      </p>
    </div>
  );
}
