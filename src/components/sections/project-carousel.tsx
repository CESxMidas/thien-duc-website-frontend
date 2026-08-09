"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Sai số cho phép khi so sánh vị trí cuộn (scrollLeft là số thực). */
const EDGE_TOLERANCE_PX = 4;

type ProjectCarouselLabels = {
  region: string;
  previous: string;
  next: string;
};

type ProjectCarouselProps = {
  /** Thẻ dự án đã render sẵn ở phía server, theo ĐÚNG thứ tự backend trả về. */
  items: ReactNode[];
  labels: ProjectCarouselLabels;
  /**
   * Nội dung đặt bên TRÁI trên cùng hàng với nút Trước/Tiếp (bộ lọc trạng thái).
   *
   * Nhận qua slot thay vì để trang tự dựng một hàng riêng: hai nút phải nằm
   * trong Client Component này để nối được với track, nên nếu bộ lọc ở ngoài thì
   * chúng vĩnh viễn là hai khối tách rời, không bao giờ căn được cùng một hàng.
   */
  toolbar?: ReactNode;
};

/**
 * Carousel dự án: cuộn ngang bằng scroll-snap gốc của trình duyệt, nút
 * Trước/Tiếp gọi `scrollBy`/`scrollTo`.
 *
 * Không dùng thư viện carousel nào (dự án không có sẵn Embla/Swiper/Keen) và
 * cũng không tự viết drag — cùng cách làm với `project-photo-strip.tsx` và
 * `cooperation-slider.tsx`: vuốt cảm ứng, cuộn ngang trackpad và cuộn đà đều là
 * hành vi gốc, chạy mượt hơn mọi bản mô phỏng bằng JS.
 *
 * **Không** autoplay. Có **vòng lặp tròn liên tục** bằng cách **xoay mảng**:
 * tới cuối bấm Tiếp thì thẻ đầu được chuyển xuống cuối rồi bù `scrollLeft` tức
 * thời, nên mắt thấy chuyển động đi tới liên tục chứ không phải cú tua ngược về
 * đầu. **Không nhân bản thẻ** — DOM luôn đúng N thẻ.
 *
 * Vòng lặp CHỈ áp cho hai nút; vuốt tay và cuộn trackpad giữ nguyên hành vi gốc
 * (dừng ở hai đầu như mọi vùng cuộn khác).
 *
 * Thẻ do Server Component truyền xuống qua `items` nên biên client chỉ bọc phần
 * logic cuộn; `next/image` trong thẻ vẫn được tối ưu phía server.
 */
export function ProjectCarousel({
  items,
  labels,
  toolbar,
}: ProjectCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  // Nút bật/tắt KHÔNG còn phụ thuộc vị trí cuộn: điều hướng nay quay vòng nên
  // hai đầu danh sách không phải điểm dừng. Thứ duy nhất quyết định là "có gì
  // để cuộn hay không" — tức có nội dung bị khuất ngoài khung nhìn.
  const [scrollable, setScrollable] = useState(false);

  const count = items.length;

  /** Số nấc đã xoay. Mảng render = `items` xoay trái `rotation` nấc. */
  const [rotation, setRotation] = useState(0);
  const pendingScrollRef = useRef<{
    compensate: number;
    animate: number;
  } | null>(null);

  const rotated = useMemo(
    () =>
      rotation === 0
        ? items
        : [...items.slice(rotation), ...items.slice(0, rotation)],
    [items, rotation],
  );

  const syncScrollable = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setScrollable(track.scrollWidth - track.clientWidth > EDGE_TOLERANCE_PX);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncScrollable();

    // ResizeObserver: số cột đổi theo breakpoint nên tương quan
    // scrollWidth/clientWidth đổi theo — ví dụ 3 dự án ở desktop lọt hết khung
    // (không cuộn được) nhưng ở tablet thì không.
    const observer = new ResizeObserver(syncScrollable);
    observer.observe(track);

    return () => observer.disconnect();
  }, [syncScrollable]);

  /** Bước cuộn = bề rộng một thẻ + gap, đọc từ DOM thật thay vì hằng số: số cột
   *  do class `basis-*` quyết định và đổi theo breakpoint. Mọi thẻ rộng bằng
   *  nhau nên bước này cũng đúng bằng lượng dịch khi xoay mảng một nấc. */
  function stepSize(track: HTMLUListElement) {
    const first = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20;

    return (first ? first.clientWidth : track.clientWidth) + gap;
  }

  /**
   * Bù `scrollLeft` NGAY SAU khi React đã commit thứ tự mảng mới, rồi mới chạy
   * animation. Hai bước phải tách: xoay mảng làm toàn bộ nội dung dịch ngang một
   * nấc, nếu không trừ/cộng lại đúng một `step` tức thời thì khung nhìn sẽ nhảy.
   *
   * `useLayoutEffect` chứ không `useEffect`: phải xong trước khi trình duyệt vẽ,
   * nếu không người dùng thấy một frame lệch.
   */
  useLayoutEffect(() => {
    const pending = pendingScrollRef.current;
    if (!pending) return;
    pendingScrollRef.current = null;

    const track = trackRef.current;
    if (!track) return;

    // Gán trực tiếp `scrollLeft` là TỨC THỜI vì track không còn class
    // `scroll-smooth` — chuyển động mượt nay do `behavior: "smooth"` của
    // `scrollBy` đảm nhiệm. Nếu để `scroll-behavior: smooth` trên CSS thì chính
    // bước bù này cũng bị animate và lộ ra cú giật.
    track.scrollLeft = Math.max(0, track.scrollLeft + pending.compensate);
    track.scrollBy({ left: pending.animate, behavior: "smooth" });
  }, [rotation]);

  /**
   * Vòng lặp tròn bằng **xoay mảng**, không nhân bản thẻ.
   *
   * Ở cuối bấm Tiếp: chuyển thẻ đầu xuống cuối (`rotation + 1`). Sau khi xoay,
   * nội dung đang hiển thị bị dịch trái đúng một `step`, nên ta trừ `scrollLeft`
   * đi một `step` tức thời để khung nhìn đứng yên, rồi cuộn tới một `step` mượt.
   * Người dùng thấy chuyển động đi tới liên tục, thẻ mới xuất hiện từ bên phải.
   *
   * Ở đầu bấm Trước: đối xứng — xoay ngược, cộng `scrollLeft` rồi cuộn lui.
   *
   * Phép bù luôn hợp lệ: mọi thẻ rộng bằng nhau nên
   * `maxScrollLeft = (N - số cột) * step`, tức khi còn cuộn được thì
   * `maxScrollLeft >= step`, `scrollLeft - step` không bao giờ âm.
   */
  function navigate(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    // Không có gì khuất thì không có gì để xoay (nút cũng đang disabled).
    if (maxScrollLeft <= EDGE_TOLERANCE_PX || count === 0) return;

    const step = stepSize(track);
    const atStart = track.scrollLeft <= EDGE_TOLERANCE_PX;
    const atEnd = track.scrollLeft >= maxScrollLeft - EDGE_TOLERANCE_PX;

    if (direction > 0 && atEnd) {
      pendingScrollRef.current = { compensate: -step, animate: step };
      setRotation((value) => (value + 1) % count);
      return;
    }

    if (direction < 0 && atStart) {
      pendingScrollRef.current = { compensate: step, animate: -step };
      setRotation((value) => (value - 1 + count) % count);
      return;
    }

    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  // Một dự án: thẻ chiếm trọn bề ngang (`basis-full`) nên không có vùng slider
  // trống — và vì không có gì khuất, `scrollable` tự false → cả hai nút disabled.
  const single = items.length === 1;

  const basis = single
    ? "basis-full"
    : items.length === 2
      ? // Hai dự án: dừng ở 2 cột, KHÔNG lên 3 — cột thứ ba sẽ là khoảng trống.
        "basis-[85%] sm:basis-full md:basis-[calc((100%-1.25rem)/2)]"
      : "basis-[85%] sm:basis-full md:basis-[calc((100%-1.25rem)/2)] xl:basis-[calc((100%-2.5rem)/3)]";

  return (
    // Fragment, không phải wrapper `<div>`: toolbar và vùng carousel là hai khối
    // block liền nhau, không cần thêm node chỉ để bọc.
    <>
      {/* MỘT hàng toolbar: bộ lọc trái, điều hướng phải, cùng `items-center`.
          `flex-wrap` + `gap-y-3` để ở màn hẹp cụm nút xuống dòng gọn gàng thay vì
          ép co; `ml-auto` giữ nút luôn nằm bên phải kể cả khi đã xuống dòng
          (`justify-between` một mình sẽ đẩy nó về trái ở dòng thứ hai). */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        {toolbar}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={!scrollable}
            aria-label={labels.previous}
            className="grid size-11 place-items-center border border-brand/30 bg-white text-brand-dark transition-colors duration-200 hover:border-brand hover:bg-gold-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-surface disabled:text-slate/50 disabled:hover:bg-surface"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={!scrollable}
            aria-label={labels.next}
            className="grid size-11 place-items-center border border-brand/30 bg-white text-brand-dark transition-colors duration-200 hover:border-brand hover:bg-gold-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-surface disabled:text-slate/50 disabled:hover:bg-surface"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Vùng được đặt tên bao ĐÚNG phần nội dung carousel. Bộ lọc trạng thái
          nằm ngoài: chúng quyết định danh sách nào được hiển thị chứ không phải
          là một phần của carousel, nên gộp vào đây sẽ mô tả sai cấu trúc.
          Bọc bằng `<div>` chứ không đặt `role="group"` thẳng lên `<ul>` — làm
          vậy sẽ ghi đè role `list` và mất luôn ngữ nghĩa danh sách. */}
      <div role="group" aria-label={labels.region}>
        {/* `snap-proximity` (không phải `mandatory`): với thẻ nhiều chiều cao và
            cuộn trackpad, `mandatory` hay giật lại giữa chừng. `pb` chừa chỗ cho
            shadow của `.hover-card` khỏi bị cắt.

            Cố ý KHÔNG có `scroll-smooth`: bước bù `scrollLeft` khi xoay mảng
            phải tức thời, còn chuyển động mượt do `behavior: "smooth"` trong JS lo. */}
        <ul
          ref={trackRef}
          className="no-scrollbar -mx-1 flex snap-x snap-proximity items-stretch gap-5 overflow-x-auto px-1 pb-2"
        >
          {rotated.map((item, index) => (
            // Khóa theo `key` của chính thẻ (ProjectCard được tạo với
            // `key={project.slug}`) chứ không theo chỉ số: khi xoay mảng, React sẽ
            // DI CHUYỂN node sẵn có thay vì dựng lại — ảnh không remount, không nháy.
            <li
              key={
                isValidElement(item) && item.key != null ? item.key : String(index)
              }
              className={`${basis} shrink-0 grow-0 snap-start list-none`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
