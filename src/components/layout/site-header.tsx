"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { mainNavigation } from "@/data/navigation";
import { localizePath, splitLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

const primaryNavigation: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Lĩnh vực", href: "/#linh-vuc-hoat-dong" },
  { label: "Dự án", href: "/du-an" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

const headerLabels: Record<Locale, Record<string, string>> = {
  vi: {
    "/": "Trang chủ",
    "/gioi-thieu": "Giới thiệu",
    "/#linh-vuc-hoat-dong": "Lĩnh vực",
    "/du-an": "Dự án",
    "/tin-tuc": "Tin tức",
    "/lien-he": "Liên hệ",
  },
  en: {
    "/": "Home",
    "/gioi-thieu": "About",
    "/#linh-vuc-hoat-dong": "Fields",
    "/du-an": "Projects",
    "/tin-tuc": "News",
    "/lien-he": "Contact",
  },
};

function isActive(path: string, item: NavItem) {
  if (item.href.includes("#")) return false;
  return item.href === "/"
    ? path === "/"
    : path === item.href || path.startsWith(`${item.href}/`);
}

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navLabel = (item: NavItem) =>
    headerLabels[locale][item.href] ??
    dictionary.navLabels[item.href] ??
    item.label;

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 border-b border-charcoal/12 bg-ivory/95 text-charcoal backdrop-blur-md"
    >
      <div className="grid h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center px-5 sm:px-8 lg:h-24 lg:px-20 xl:px-28">
        <Link
          href={localizePath(routes.home, locale)}
          className="flex shrink-0 items-center"
          aria-label={dictionary.shared.homeAriaLabel}
        >
          <Image
            src="/images/brand/logo-thien-duc.png"
            alt={dictionary.shared.logoAlt}
            width={126}
            height={80}
            preload
            className="h-[4.5rem] w-auto object-contain lg:h-[5.75rem]"
          />
        </Link>

        <nav
          className="hidden items-center justify-center gap-4 lg:flex xl:gap-5"
          aria-label="Primary"
        >
          {primaryNavigation.map((item) => {
            const active = isActive(path, item);
            return (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-12 items-center overflow-hidden rounded-[6px] border px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.1em] shadow-[0_6px_14px_rgba(139,115,94,0.045)] transition before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_70%)] before:opacity-0 before:transition before:duration-500 hover:before:opacity-100 xl:px-6 ${
                  active
                    ? "border-transparent bg-[linear-gradient(135deg,#c1ad92_0%,#d0ba82_52%,#b9a68d_100%)] text-ivory shadow-[0_10px_20px_rgba(139,115,94,0.09)]"
                    : "border-transparent bg-[linear-gradient(135deg,rgba(235,229,222,0.78)_0%,rgba(196,154,63,0.18)_48%,rgba(246,244,239,0.88)_100%)] text-earth hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#b99a70_0%,#cdaa60_48%,#a08361_100%)] hover:text-ivory hover:shadow-[0_12px_24px_rgba(139,115,94,0.14)]"
                }`}
              >
                {navLabel(item)}
              </Link>
            );
          })}
        </nav>

        <div className="relative ml-auto flex items-center justify-end gap-1 lg:ml-0">
          <button
            type="button"
            aria-label={dictionary.header.searchLabel}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            className="grid size-10 place-items-center text-charcoal/70 transition-colors hover:text-earth"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </button>
          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcher}
            showIcon={false}
            className="hidden sm:inline-flex"
          />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen
                ? dictionary.header.closeMenu
                : dictionary.header.openMenu
            }
            className="grid size-11 place-items-center lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {searchOpen ? (
            <form
              id="header-search-panel"
              role="search"
              action={localizePath(routes.search, locale)}
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 flex w-[min(22rem,calc(100vw-2.5rem))] items-center overflow-hidden border border-earth/25 bg-ivory shadow-[0_18px_50px_rgba(41,41,41,0.16)]"
            >
              <label htmlFor="header-search-input" className="sr-only">
                {dictionary.header.searchLabel}
              </label>
              <input
                ref={searchInputRef}
                id="header-search-input"
                name="q"
                type="search"
                placeholder={dictionary.header.searchPlaceholder}
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-charcoal outline-none placeholder:text-charcoal/45"
              />
              <button
                type="submit"
                aria-label={dictionary.header.searchSubmit}
                className="grid h-12 w-12 shrink-0 place-items-center bg-earth text-ivory transition hover:bg-charcoal"
              >
                <Search className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={dictionary.header.closeMenu}
                onClick={() => setSearchOpen(false)}
                className="grid h-12 w-12 shrink-0 place-items-center text-charcoal/55 transition hover:text-charcoal"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`border-t border-charcoal/10 bg-ivory lg:hidden ${menuOpen ? "block" : "hidden"}`}
      >
        <nav className="mx-auto max-h-[calc(100svh-4.5rem)] max-w-site overflow-y-auto px-4 py-5 sm:px-6">
          <ul className="divide-y divide-charcoal/10">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, locale)}
                  onClick={() => setMenuOpen(false)}
                  className="my-2 flex min-h-12 items-center justify-between rounded-[6px] border border-earth/18 bg-gold-soft/65 px-4 py-3 text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-earth"
                >
                  {navLabel(item)}
                  <span aria-hidden="true">↗</span>
                </Link>
                {item.children?.length ? (
                  <ul className="mb-4 grid gap-2 border-l border-earth/45 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={localizePath(child.href, locale)}
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex min-h-10 items-center text-sm text-charcoal/65 hover:text-earth"
                        >
                          {navLabel(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcher}
            showIcon={false}
            className="mt-5 sm:hidden"
          />
        </nav>
      </div>
    </header>
  );
}
