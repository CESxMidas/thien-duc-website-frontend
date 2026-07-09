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
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

const DROPDOWN_CLOSE_DELAY_MS = 150;

const topStripLinkClassName =
  "inline-flex min-w-0 items-center gap-2 text-white/90 transition hover:text-gold";

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
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
    <div className="border-b border-brand/25 bg-brand-soft">
      <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-6 md:py-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            title={siteConfig.address}
            className={`${topStripLinkClassName} order-2 text-center text-xs leading-5 sm:text-sm lg:order-1 lg:flex-1 lg:text-left`}
          >
            <MapPin
              className="mx-auto size-4 shrink-0 text-gold lg:mx-0"
              aria-hidden="true"
            />
            <span className="line-clamp-2 lg:line-clamp-1">{siteConfig.address}</span>
          </a>

          <div className="order-1 flex items-center justify-center gap-3 sm:gap-4 lg:order-2 lg:shrink-0">
            <a href={phoneHref} className={`${topStripLinkClassName} font-semibold`}>
              <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="whitespace-nowrap">{siteConfig.phone}</span>
            </a>

            <span
              className="hidden h-4 w-px shrink-0 bg-white/35 sm:block"
              aria-hidden="true"
            />

            <a
              href={emailHref}
              className={`${topStripLinkClassName} max-w-44 min-[400px]:max-w-none`}
            >
              <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="truncate sm:whitespace-nowrap">{siteConfig.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <header
      id="site-header"
      className="relative z-40 bg-white text-ink shadow-md"
    >
      <HeaderTopStrip />

      <div className="border-b-[3px] border-gold bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-18 md:px-6 lg:gap-5.25">
          <Link
            href="/"
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
              const active = isActive(pathname, item);
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
                    href={item.href}
                    aria-haspopup={hasChildren || undefined}
                    aria-expanded={hasChildren ? dropdownOpen : undefined}
                    className={`nav-link-polish inline-flex h-16 items-center gap-1 whitespace-nowrap border-b-[3px] px-2 text-[13px] font-bold uppercase tracking-[0.02em] xl:px-2.5 xl:text-sm md:h-18 ${
                      active
                        ? "border-brand text-brand"
                        : "border-transparent text-ink hover:border-brand/40 hover:text-brand-dark"
                    }`}
                  >
                    {item.label}
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
                              {group.heading}
                            </p>
                          ) : null}
                          {group.items.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className="nav-dropdown-item block border-b border-brand-dark/30 px-7 py-3.5 text-sm font-bold uppercase text-white last:border-b-0 hover:bg-brand-dark"
                            >
                              {child.label}
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

          <form action={routes.news} className="hidden shrink-0 items-center lg:flex">
            <label className="sr-only" htmlFor="site-search">
              Tìm kiếm tin tức
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Tìm tin tức..."
              className="h-10 w-36 border border-brand/30 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate focus:border-brand xl:w-44"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm tin tức"
              className="button-polish grid h-10 w-10 place-items-center bg-brand text-white hover:bg-brand-dark"
            >
              <Search className="size-4" />
            </button>
          </form>

          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-10 place-items-center border-2 border-brand/35 text-brand-dark lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/10 bg-white px-4 pb-5 lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 py-4">
              {mainNavigation.map((item) => {
                if (!item.children?.length) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center justify-between border-b border-brand/15 text-sm font-bold uppercase text-ink"
                    >
                      {item.label}
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
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 shrink-0 text-brand-dark transition-transform duration-200 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded ? (
                      <div className="grid border-b border-brand/15 bg-gold-soft">
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-3 text-sm font-semibold text-[#5a3a12] hover:text-brand"
                        >
                          {item.overviewLabel ?? item.label}
                        </Link>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 text-sm font-semibold text-[#5a3a12] hover:text-brand"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
            <form action={routes.news} className="mx-auto flex max-w-7xl">
              <input
                name="q"
                type="search"
                placeholder="Tìm tin tức..."
                className="h-11 min-w-0 flex-1 border border-brand/30 px-4 text-sm text-ink outline-none focus:border-brand"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm tin tức"
                className="grid h-11 w-12 place-items-center bg-brand text-white"
              >
                <Search className="size-5" />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}
