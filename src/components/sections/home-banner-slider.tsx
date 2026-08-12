"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  KeyboardEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { HomeBanner } from "@/data/banners";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

/* ---------------------------------------------------------------------------
   Nhóm hằng số thời gian — để CẠNH NHAU có chủ đích.

   Ba giá trị này ràng buộc nhau: đổi một mà quên hai cái kia là lỗi đã từng
   xảy ra (chu kỳ 7000ms, còn Ken Burns bị chôn trong class Tailwind
   `duration-7200`, nên sửa chu kỳ là hiệu ứng phóng ảnh lệch pha ngay).

   - AUTOPLAY_MS   : chu kỳ tự chuyển slide (đồng hồ đếm CHÍNH là thanh tiến trình).
   - TRANSITION_MS : thời lượng mờ chồng giữa hai slide. KHÁC chu kỳ — đây là
                     hiệu ứng chuyển cảnh, không phải nhịp chuyển.
   - KEN_BURNS_MS  : SUY RA từ chu kỳ, dài hơn một nhịp ngắn để ảnh không kết
                     thúc cú phóng đúng lúc slide đổi (sẽ thấy khựng).
   --------------------------------------------------------------------------- */
const AUTOPLAY_MS = 4500;
const TRANSITION_MS = 600;
const KEN_BURNS_MS = AUTOPLAY_MS + 200;

const MANUAL_PAUSE_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;

/** Đánh dấu nút tạm dừng/tiếp tục để luật focus bên dưới loại trừ được nó. */
const AUTOPLAY_TOGGLE_ATTR = "data-banner-autoplay-toggle";

function isAutoplayToggle(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest(`[${AUTOPLAY_TOGGLE_ATTR}]`) !== null
  );
}

type HomeBannerSliderProps = {
  banners: HomeBanner[];
  locale: Locale;
  contactCtaLabel: string;
  /** Nhãn a11y song ngữ do server truyền vào (client không nạp dictionary). */
  labels: Dictionary["homeBanner"];
};

/**
 * Banner do CMS quản lý — dữ liệu nạp ở server (`HomeBannerSection`) rồi truyền
 * xuống đây, vì carousel cần state và sự kiện chuột/bàn phím.
 */
export function HomeBannerSlider({
  banners,
  locale,
  contactCtaLabel,
  labels,
}: HomeBannerSliderProps) {
  const bannerCount = banners.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  /**
   * Người dùng bấm nút "Tạm dừng" — khác hẳn `manualPaused` (tạm dừng 12 giây
   * sau khi bấm tiến/lùi rồi tự chạy lại). Trạng thái này **giữ nguyên cho tới
   * khi bấm "Tiếp tục"**: đó là điều WCAG 2.2.2 đòi hỏi, tạm dừng có hạn không
   * được tính là cơ chế dừng.
   */
  const [userStopped, setUserStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const manualPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeBanner = banners[activeIndex];
  const autoplayEnabled = bannerCount > 1 && !reducedMotion;
  const isPaused = hoverPaused || tabHidden || manualPaused || userStopped;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);

    const syncVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", syncVisibility);
      if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
    };
  }, []);

  /** Người dùng tự điều khiển → tạm dừng autoplay 12s rồi chạy tiếp. */
  function pauseForManualInteraction() {
    setManualPaused(true);
    if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
    manualPauseTimer.current = setTimeout(
      () => setManualPaused(false),
      MANUAL_PAUSE_MS,
    );
  }

  function goToPrevious() {
    pauseForManualInteraction();
    setActiveIndex((current) => (current === 0 ? bannerCount - 1 : current - 1));
  }

  function goToNext() {
    pauseForManualInteraction();
    setActiveIndex((current) => (current + 1) % bannerCount);
  }

  function goToSlide(index: number) {
    pauseForManualInteraction();
    setActiveIndex(index);
  }

  /**
   * Bật/tắt tự chuyển slide. Khi bấm "Tiếp tục" phải **xoá luôn** khoảng tạm
   * dừng 12 giây của thao tác tay: người dùng vừa yêu cầu chạy tiếp, để nó đứng
   * im thêm mười giây nữa thì nút trông như hỏng.
   */
  function toggleAutoplay() {
    const resuming = userStopped;
    setUserStopped(!userStopped);

    // Gọi setState KHÁC bên trong hàm cập nhật của `setUserStopped` là tác dụng
    // phụ trong một hàm phải thuần — React được phép chạy hàm đó hai lần (chế
    // độ Strict lúc dev) nên hành vi sẽ không xác định. Tính trước rồi gọi tuần
    // tự; hai lệnh setState trong cùng một handler vẫn được gộp một lần render.
    if (resuming) {
      if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
      setManualPaused(false);
    }
  }

  function handleProgressEnd() {
    if (autoplayEnabled && !isPaused) {
      setActiveIndex((current) => (current + 1) % bannerCount);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const deltaX =
      (event.changedTouches[0]?.clientX ?? touchStartX.current) -
      touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) goToNext();
    else goToPrevious();
  }

  // Banner đến từ CMS: biên tập viên có thể tắt hết, khi đó không render gì.
  // Hook phải khai báo xong trước lần return sớm này.
  if (bannerCount === 0 || !activeBanner) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden bg-ink"
      aria-label={labels.regionLabel}
      aria-roledescription="carousel"
      onPointerEnter={() => setHoverPaused(true)}
      onPointerLeave={() => setHoverPaused(false)}
      /* Tạm dừng khi focus rơi vào banner — TRỪ chính nút tạm dừng/tiếp tục.
         Bấm một nút luôn làm nó nhận focus, nên nếu không loại trừ thì nút
         "Tiếp tục" tự vô hiệu hoá chính nó: bấm xong autoplay vẫn đứng im cho
         tới khi focus rời đi. Đã đo trên trình duyệt thật — sau khi bấm tiếp
         tục và rời chuột, `animationPlayState` vẫn là "paused" suốt 6 giây. */
      onFocus={(event) => {
        if (!isAutoplayToggle(event.target)) setHoverPaused(true);
      }}
      onBlur={(event) => {
        if (!isAutoplayToggle(event.target)) setHoverPaused(false);
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[clamp(32rem,75svh,51.25rem)]">
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${bannerCount}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                quality={90}
                sizes="100vw"
                className={`object-cover transition ease-out ${
                  isActive && !reducedMotion ? "scale-105" : "scale-100"
                }`}
                style={{
                  objectPosition: banner.objectPosition ?? "center center",
                  // Suy từ AUTOPLAY_MS, không gõ số cứng: xem khối hằng số ở đầu file.
                  transitionDuration: `${KEN_BURNS_MS}ms`,
                }}
              />
            </div>
          );
        })}

        {/* Lớp phủ nhẹ hơn hẳn bản cũ (0.72 → 0.5): khối chữ bên dưới đã có nền
            ink/28 + backdrop-blur riêng nên vẫn đọc rõ, còn ảnh banner sáng và
            trong trẻo hơn thay vì bị tối. Vẫn giữ độ tối phía trái để mép thẻ
            chữ hoà vào nền, nhạt dần về phải để lộ chi tiết ảnh. */}
        <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(25,25,25,0.5)_0%,rgba(25,25,25,0.26)_45%,rgba(25,25,25,0.04)_100%)]" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_78%,rgba(253,205,4,0.16),transparent_32%)]" />

        {autoplayEnabled ? (
          <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
            <div
              key={activeIndex}
              className="banner-progress h-full bg-gold"
              onAnimationEnd={handleProgressEnd}
              style={{
                animationDuration: `${AUTOPLAY_MS}ms`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        ) : null}

        {/* Khối chữ cố ý hẹp hơn bản cũ (`max-w-2xl` = 672px → 544px) và hạ thấp
            hơn (`bottom-16/20` → `bottom-12/16`): ảnh banner là nội dung chính,
            chữ chỉ dẫn vào nó. Đệm `p-5 sm:p-7` GIỮ NGUYÊN — đó là thứ giữ chữ
            đọc được trên nền ảnh, thu nó lại là đánh đổi sai.

            `bottom-18` (72px) là giá trị ĐO ĐƯỢC, không phải ước lượng: dải
            điều khiển dưới đáy (hàng chấm ở `bottom-5`, cao thật 46px kể cả
            viền) chiếm 20–66px. Mọi giá trị nhỏ hơn 66px làm mép dưới thẻ chữ
            chui xuống dưới hàng chấm — đã đo thấy chồng 10px ở 320/390px và
            2px ở 768/1440px. 72px chừa 6px thở.

            Vẫn thấp hơn bản cũ ở desktop (80px), và ở mobile phần thu gọn thật
            sự đến từ `line-clamp-2` chứ không phải từ việc hạ khối chữ. */}
        <div className="absolute inset-x-0 bottom-18 z-30 px-4 sm:px-6">
          <div className="mx-auto max-w-site">
            <div
              key={activeBanner.title}
              className={`flex max-w-136 flex-col justify-between border border-white/15 bg-ink/28 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-7 ${
                reducedMotion ? "" : "banner-copy-in"
              }`}
            >
              {/* Chỉ số slide nằm CÙNG HÀNG với eyebrow. Trước đây nó là một cột
                  riêng bên trái, ăn ~60px bề ngang của MỌI dòng chữ kể cả tiêu
                  đề — thông tin phụ chiếm chỗ của thông tin chính. */}
              {/* Bỏ vạch kẻ mảnh trang trí (`h-px flex-1 bg-white/25`) vốn nằm
                  giữa eyebrow và số thứ tự slide: nó không mang trạng thái hay
                  tiến trình nào, chỉ lấp chỗ. `justify-between` thay nó làm việc
                  giãn cách, nên bố cục giữ nguyên mà bớt một nét trang trí.
                  KHÔNG đụng thanh tiến trình `.banner-progress` hay chấm
                  `aria-current` — đó là chỉ báo trạng thái thật. */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-eyebrow text-gold">
                  {activeBanner.eyebrow}
                </p>
                <p className="hidden shrink-0 text-sm font-semibold text-white/70 sm:block">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-white/30">/</span>
                  {String(bannerCount).padStart(2, "0")}
                </p>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <h1 className="line-clamp-2 text-[1.6rem] font-semibold leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
                  {activeBanner.title}
                </h1>
                {/* Clamp 2 dòng ở mobile: ở 320px hero chỉ cao 512px, dòng thứ
                    ba của phụ đề là phần đẩy khối chữ che gần hết khung ảnh. */}
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/85 sm:line-clamp-3 sm:text-base lg:text-lg">
                  {activeBanner.subtitle}
                </p>
                <div className="mt-5 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap sm:mt-6">
                  <Link
                    href={localizePath(activeBanner.href, locale)}
                    className="button-polish inline-flex h-11 items-center justify-center px-4 text-center text-sm font-semibold text-ink transition bg-gold hover:bg-white sm:px-5"
                  >
                    {activeBanner.ctaLabel}
                  </Link>
                  <Link
                    href={localizePath(routes.contact, locale)}
                    className="button-polish inline-flex h-11 items-center justify-center border border-white/60 px-4 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-ink sm:px-5"
                  >
                    {contactCtaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2">
          {/* WCAG 2.2.2 (Pause, Stop, Hide — mức A): nội dung tự chuyển động
              phải có cơ chế DỪNG dùng được. Tạm dừng khi rê chuột KHÔNG tính —
              bàn phím và cảm ứng không rê được. Nút này giữ trạng thái cho tới
              khi bấm lại, khác với khoảng nghỉ 12 giây sau thao tác tiến/lùi.

              Chỉ render khi autoplay thật sự chạy: ở `prefers-reduced-motion`
              autoplay vốn đã tắt, hiện một nút "Tạm dừng" ở đó là nói dối về
              trạng thái của carousel.

              Không đặt `aria-pressed`: nhãn của nút đã đổi theo trạng thái
              ("Tạm dừng" ↔ "Tiếp tục") đúng theo mẫu Carousel của WAI-ARIA APG.
              Gắn thêm `aria-pressed` sẽ khiến trình đọc màn hình đọc "Tiếp tục,
              nút chuyển, đã bật" — hai tín hiệu trạng thái chồng nhau, ngược
              nhau. Trạng thái nhìn thấy được thể hiện bằng biểu tượng + màu. */}
          {autoplayEnabled ? (
            <button
              type="button"
              data-testid="banner-autoplay-toggle"
              {...{ [AUTOPLAY_TOGGLE_ATTR]: "" }}
              data-paused={userStopped}
              aria-label={userStopped ? labels.ariaPlay : labels.ariaPause}
              onClick={toggleAutoplay}
              className={`button-polish grid size-11 place-items-center border backdrop-blur transition-colors md:size-11 ${
                userStopped
                  ? "border-gold bg-gold text-ink"
                  : "border-white/40 bg-ink/30 text-white hover:border-gold hover:bg-gold hover:text-ink"
              }`}
            >
              {userStopped ? (
                <Play className="size-5" aria-hidden="true" />
              ) : (
                <Pause className="size-5" aria-hidden="true" />
              )}
            </button>
          ) : null}
          <button
            type="button"
            aria-label={labels.ariaPrevious}
            onClick={goToPrevious}
            /* Nút tiến/lùi vẫn ẩn ở mobile (đã có vuốt + chấm chỉ báo), nhưng
               nút tạm dừng thì KHÔNG được ẩn — cảm ứng không rê chuột được nên
               ở đó nó là cơ chế dừng duy nhất. Vì vậy `hidden sm:grid` chuyển
               từ khối cha xuống riêng hai nút này. */
            className="button-polish hidden size-9 place-items-center border border-white/40 bg-ink/30 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink sm:grid md:size-11"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={labels.ariaNext}
            onClick={goToNext}
            className="button-polish hidden size-9 place-items-center border border-white/40 bg-ink/30 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink sm:grid md:size-11"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Hàng chấm chỉ báo căn giữa TRONG một hộp có chừa lề phải ở mobile:
            nút tạm dừng nằm ở góc phải dưới và ở 320px, hàng chấm căn giữa
            nguyên bản sẽ chui xuống dưới nó. Ở `sm` trở lên hộp bỏ lề, chấm về
            đúng chính giữa như cũ. */}
        {/* `pointer-events-none` trên khung căn giữa là BẮT BUỘC: khung này
            trải hết bề ngang (`inset-x-0`) ở cùng `z-30` và đứng SAU cụm nút
            trong DOM, nên nếu nhận sự kiện chuột nó sẽ nuốt mọi cú bấm vào nút
            tạm dừng / tiến / lùi — đã đo được bằng trình duyệt thật:
            "…intercepts pointer events". Chỉ viên chấm bên trong mới bắt chuột. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center pl-4 pr-14 sm:px-0">
          <div className="pointer-events-auto flex items-center rounded-full border border-white/20 bg-ink/25 px-1 backdrop-blur">
            {banners.map((banner, index) => (
              <button
                key={banner.image}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(index + 1),
                })}
                aria-current={index === activeIndex}
                onClick={() => goToSlide(index)}
                // 36px ngang ở mobile (vẫn vượt ngưỡng 24px của WCAG 2.5.8) để
                // cả hàng không đụng nút tạm dừng; 44px từ `sm` như cũ.
                className="grid min-h-11 min-w-9 place-items-center sm:min-w-11"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-9 bg-gold"
                      : "w-2.5 bg-white/70 hover:bg-white"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
