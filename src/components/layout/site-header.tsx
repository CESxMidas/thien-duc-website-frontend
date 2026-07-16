"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { localizePath, splitLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

const DROPDOWN_CLOSE_DELAY_MS = 150;

const topStripLinkClassName =
  "inline-flex min-h-11 min-w-0 items-center gap-2 rounded-sm text-white/90 transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/** `path` đã bỏ tiền tố locale nên so khớp được với href gốc trong `navigation.ts`. */
function isActive(path: string, item: NavItem) {
  if (item.href === "/") {
    return path === "/";
  }

  return path === item.href || path.startsWith(`${item.href}/`);
}

/** Gom children theo group (giữ thứ tự xuất hiện); item không có group đứng nhóm không tiêu đề. */
function groupChildren(children: NavItem[]) {
  const groups: { heading?: string; items: NavItem[] }[] = [];

  for (const child of children) {
    const last = groups[groups.length - 1];
    if (last && last.heading === child.group) {
      last.items.push(child);
    } else {
      groups.push({ heading: child.group, items: [child] });
    }
  }

  return groups;
}

function HeaderTopStrip() {
  return (
    <div className="header-top-strip grid bg-brand-soft">
      <div className="min-h-0 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-1.5 md:px-6 md:py-2">
        <div className="grid min-w-0 gap-x-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            title={siteConfig.address}
            className={`${topStripLinkClassName} col-span-full text-xs leading-5 sm:text-sm lg:col-span-1`}
          >
            <MapPin
              className="size-4 shrink-0 text-gold"
              aria-hidden="true"
            />
            <span className="line-clamp-2 lg:line-clamp-1">{siteConfig.address}</span>
          </a>

          <div className="col-span-full grid min-w-0 grid-cols-2 border-t border-white/15 sm:border-t-0 lg:col-span-1 lg:flex lg:shrink-0 lg:gap-4">
            <a href={phoneHref} className={`${topStripLinkClassName} font-semibold`}>
              <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="whitespace-nowrap">{siteConfig.phone}</span>
            </a>

            <a
              href={emailHref}
              className={`${topStripLinkClassName} justify-end border-l border-white/15 pl-3 lg:border-l-0 lg:pl-0`}
            >
              <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="truncate sm:whitespace-nowrap">{siteConfig.email}</span>
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  const searchAction = localizePath(routes.news, locale);

  /** Nhãn điều hướng dịch theo `href`; thiếu bản dịch thì giữ nguyên tiếng Việt. */
  const navLabel = (item: NavItem) => dictionary.navLabels[item.href] ?? item.label;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return;

    // Thay vì đọc `window.scrollY` theo ngưỡng — vốn nhiễu trên mobile (thanh URL
    // show/hide + đà cuộn) và bị chính việc co/giãn top-strip làm nhảy giá trị,
    // gây lật trạng thái liên tục (nhấp nháy) — ta quan sát một "sentinel" đặt
    // absolute ở đỉnh trang cao 96px. Sentinel nằm ngoài luồng nên header đổi
    // chiều cao không dịch chuyển nó; IntersectionObserver chỉ chốt theo vị trí
    // cuộn tuyệt đối, không thể tạo vòng phản hồi.
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    // Khoá cuộn nền bằng kỹ thuật `position: fixed` thay vì `overflow: hidden`.
    // Đặt `overflow: hidden` lên body biến body thành scroll container, khiến
    // header `sticky` mất mốc và tụt về đỉnh tài liệu (biến mất khỏi màn hình khi
    // đang cuộn). Ghim body ở vị trí cuộn hiện tại giữ header sticky nguyên chỗ.
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Chuyển sang breakpoint desktop khi menu đang mở: đóng menu và mở khoá cuộn,
  // tránh kẹt trạng thái `fixed` trên body khi người dùng phóng to cửa sổ.
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [menuOpen]);

  useEffect(() => {
    const header = document.getElementById("site-header");

    if (!header) {
      return;
    }

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`,
      );
    };

    syncHeaderHeight();

    const resizeObserver = new ResizeObserver(syncHeaderHeight);
    resizeObserver.observe(header);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [menuOpen]);

  function openDropdownNow(href: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(href);
  }

  /** Đóng sau 150ms để chuột trượt chéo xuống dropdown không bị mất menu. */
  function closeDropdownDelayed() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(
      () => setOpenDropdown(null),
      DROPDOWN_CLOSE_DELAY_MS,
    );
  }

  return (
    <>
      {/* Mốc phát hiện cuộn: absolute ở đỉnh trang, cao 96px, vô hình. Nằm ngoài
          luồng nên header sticky co/giãn không làm nó dịch chuyển — tránh vòng
          lật trạng thái gây nhấp nháy. */}
      <div
        ref={scrollSentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
      />
      <header
        id="site-header"
        data-scrolled={isScrolled || undefined}
        className="sticky top-0 z-40 bg-white text-ink shadow-md"
      >
        <HeaderTopStrip />

      <div className="border-b-[3px] border-gold bg-linear-to-b from-white to-cream">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-18 md:px-6 lg:gap-5.25">
          <Link
            href={localizePath("/", locale)}
            className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white p-1.5 shadow-sm md:size-14"
            aria-label="Trang chủ Thiên Đức"
          >
            <Image
              src="/images/brand/logo-thien-duc.png"
              alt="Logo Thiên Đức"
              width={56}
              height={56}
              preload
              className="size-full object-contain"
            />
          </Link>

          <nav
            className="hidden h-full min-w-0 flex-1 items-center justify-between border-l border-brand/15 lg:flex"
            onKeyDown={(event) => {
              if (event.key === "Escape" && openDropdown) {
                setOpenDropdown(null);
                (document.activeElement as HTMLElement | null)?.blur();
              }
            }}
          >
            {mainNavigation.map((item) => {
              const active = isActive(path, item);
              const hasChildren = Boolean(item.children?.length);
              const dropdownOpen = openDropdown === item.href;

              return (
                <div
                  key={item.href}
                  className="group relative flex shrink-0 items-center"
                  onPointerEnter={
                    hasChildren ? () => openDropdownNow(item.href) : undefined
                  }
                  onPointerLeave={hasChildren ? closeDropdownDelayed : undefined}
                  onFocus={
                    hasChildren ? () => openDropdownNow(item.href) : undefined
                  }
                  onBlur={hasChildren ? closeDropdownDelayed : undefined}
                >
                  <Link
                    href={localizePath(item.href, locale)}
                    aria-haspopup={hasChildren || undefined}
                    aria-expanded={hasChildren ? dropdownOpen : undefined}
                    className={`nav-link-polish inline-flex h-16 items-center gap-1 whitespace-nowrap border-b-[3px] px-2 text-[13px] font-bold uppercase tracking-[0.02em] xl:px-2.5 xl:text-sm md:h-18 ${
                      active
                        ? "border-brand text-brand"
                        : dropdownOpen
                          ? "border-brand/40 text-brand-dark"
                          : "border-transparent text-ink hover:border-brand/40 hover:text-brand-dark"
                    }`}
                  >
                    {navLabel(item)}
                    {hasChildren ? (
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-3.5 shrink-0 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    ) : null}
                  </Link>

                  {item.children ? (
                    <div
                      onPointerEnter={() => openDropdownNow(item.href)}
                      className={`absolute left-0 top-full z-50 min-w-72 bg-brand shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-[opacity,visibility] duration-200 ease-out ${
                        dropdownOpen
                          ? "visible opacity-100"
                          : "invisible opacity-0"
                      }`}
                    >
                      {groupChildren(item.children).map((group, groupIndex) => (
                        <div
                          key={group.heading ?? `group-${groupIndex}`}
                          className={
                            groupIndex > 0
                              ? "border-t border-brand-dark/40"
                              : undefined
                          }
                        >
                          {group.heading ? (
                            <p className="px-7 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                              {dictionary.navGroups[group.heading] ?? group.heading}
                            </p>
                          ) : null}
                          {group.items.map((child) => (
                            <Link
                              key={child.href}
                              href={localizePath(child.href, locale)}
                              onClick={() => setOpenDropdown(null)}
                              className="nav-dropdown-item block border-b border-brand-dark/30 px-7 py-3.5 text-sm font-bold uppercase text-white last:border-b-0 hover:bg-brand-dark"
                            >
                              {navLabel(child)}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <form
            action={searchAction}
            className="hidden shrink-0 items-center xl:flex"
          >
            <label className="sr-only" htmlFor="site-search">
              {dictionary.header.searchLabel}
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder={dictionary.header.searchPlaceholder}
              className="h-10 w-36 border border-brand/30 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate focus:border-brand xl:w-44"
            />
            <button
              type="submit"
              aria-label={dictionary.header.searchLabel}
              className="button-polish grid h-10 w-10 place-items-center bg-brand text-white hover:bg-brand-dark"
            >
              <Search className="size-4" />
            </button>
          </form>

          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcher}
            className="hidden shrink-0 xl:flex"
          />

          <button
            type="button"
            aria-label={menuOpen ? dictionary.header.closeMenu : dictionary.header.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-sm border-2 border-brand/35 text-brand-dark transition-colors duration-200 hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

          <div
            aria-hidden={!menuOpen}
            // `inert` removes closed drawer controls from keyboard and screen-reader flow.
            inert={!menuOpen ? true : undefined}
            className={`mobile-menu-overlay fixed inset-x-0 bottom-0 top-(--site-header-height) lg:hidden ${menuOpen ? "is-open" : ""}`}
          >
            {/* Lớp nền mờ: chạm ra ngoài để đóng menu. */}
            <button
              type="button"
              aria-label={dictionary.header.closeMenu}
              tabIndex={-1}
              onClick={() => setMenuOpen(false)}
              className="mobile-menu-backdrop absolute inset-0 h-full w-full bg-ink/40"
            />
            <div className="mobile-menu-sheet absolute inset-x-0 top-0 max-h-full overflow-y-auto overscroll-contain border-t border-black/10 bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl">
            <nav className="mx-auto grid max-w-7xl gap-1 py-4">
              {mainNavigation.map((item) => {
                if (!item.children?.length) {
                  return (
                    <Link
                      key={item.href}
                      href={localizePath(item.href, locale)}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center justify-between border-b border-brand/15 text-sm font-bold uppercase text-ink"
                    >
                      {navLabel(item)}
                    </Link>
                  );
                }

                const expanded = mobileExpanded === item.href;

                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileExpanded(expanded ? null : item.href)
                      }
                      className="flex min-h-11 w-full items-center justify-between border-b border-brand/15 text-left text-sm font-bold uppercase text-ink"
                    >
                      {navLabel(item)}
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 shrink-0 text-brand-dark transition-transform duration-200 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                      <div className={`mobile-submenu grid ${expanded ? "is-open" : ""}`}>
                        <div className="min-h-0 overflow-hidden border-b border-brand/15 bg-gold-soft">
                        <Link
                          href={localizePath(item.href, locale)}
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-brand-dark hover:text-brand"
                        >
                          {dictionary.navOverviewLabels[item.href] ??
                            item.overviewLabel ??
                            navLabel(item)}
                        </Link>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={localizePath(child.href, locale)}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-brand-dark hover:text-brand"
                          >
                            {navLabel(child)}
                          </Link>
                        ))}
                        </div>
                      </div>
                  </div>
                );
              })}
            </nav>
            <form action={searchAction} className="mx-auto flex max-w-7xl">
              <input
                name="q"
                type="search"
                placeholder={dictionary.header.searchPlaceholder}
                className="h-11 min-w-0 flex-1 border border-brand/30 px-4 text-sm text-ink outline-none focus:border-brand"
              />
              <button
                type="submit"
                aria-label={dictionary.header.searchLabel}
                className="grid h-11 w-12 place-items-center bg-brand text-white"
              >
                <Search className="size-5" />
              </button>
            </form>

            <LanguageSwitcher
              locale={locale}
              label={dictionary.common.languageSwitcher}
              className="mt-4"
            />
            </div>
          </div>
      </div>
      </header>
    </>
  );
}
