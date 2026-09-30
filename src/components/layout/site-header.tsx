"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, Search, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { zaloContact, zaloDisplayValue } from "@/config/site";
import { mainNavigation } from "@/data/navigation";
import type { BrandingSettings } from "@/lib/api/settings";
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
  branding?: BrandingSettings;
  variant?: "default" | "home-after-banner";
};

export function SiteHeader({
  locale,
  dictionary,
  branding,
  variant = "default",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const homeAfterBanner = variant === "home-after-banner";
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
      data-variant={variant}
      className={
        homeAfterBanner
          ? "sticky top-0 z-40 border-b border-white/14 bg-olive text-white"
          : "sticky top-0 z-40 border-b border-charcoal/12 bg-ivory text-charcoal"
      }
    >
      <div
        className={
          homeAfterBanner
            ? "grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-olive px-4 shadow-[0_12px_32px_rgba(41,41,41,0.16)] sm:px-6 lg:min-h-24 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-14 xl:px-20"
            : "grid h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center px-5 sm:px-8 lg:h-32 lg:px-20 xl:px-28"
        }
      >
        <Link
          href={localizePath(routes.home, locale)}
          className="flex shrink-0 items-center"
          aria-label={dictionary.shared.homeAriaLabel}
        >
          <Image
            src={
              branding?.logoUrl ||
              "/images/brand/logo-thien-duc-header-transparent.png"
            }
            alt={branding?.logoAlt || dictionary.shared.logoAlt}
            width={126}
            height={80}
            preload
            className={
              homeAfterBanner
                ? "h-14 w-auto object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.24)] sm:h-16 lg:h-[4.5rem]"
                : "h-[5.25rem] w-auto object-contain lg:h-[6.75rem]"
            }
          />
        </Link>

        <nav
          className={
            homeAfterBanner
              ? "hidden items-center justify-center gap-2 xl:flex"
              : "hidden items-center justify-center gap-4 lg:flex xl:gap-5"
          }
          aria-label="Primary"
        >
          {primaryNavigation.map((item) => {
            const active = isActive(path, item);
            return (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                aria-current={active ? "page" : undefined}
                className={
                  homeAfterBanner
                    ? `relative flex h-11 items-center rounded-[6px] px-4 text-[0.74rem] font-extrabold uppercase tracking-[0.1em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                        active
                          ? "bg-white/14 text-gold"
                          : "text-white/84 hover:bg-white/10 hover:text-gold"
                      }`
                    : `relative flex h-14 items-center overflow-hidden rounded-[7px] border px-6 text-[0.86rem] font-extrabold uppercase tracking-[0.1em] shadow-[0_6px_14px_rgba(139,115,94,0.045)] transition before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_70%)] before:opacity-0 before:transition before:duration-500 hover:before:opacity-100 xl:px-7 ${
                        active
                          ? "border-transparent bg-[linear-gradient(135deg,#c1ad92_0%,#d0ba82_52%,#b9a68d_100%)] text-ivory shadow-[0_10px_20px_rgba(139,115,94,0.09)]"
                          : "border-transparent bg-[linear-gradient(135deg,rgba(235,229,222,0.78)_0%,rgba(196,154,63,0.18)_48%,rgba(246,244,239,0.88)_100%)] text-earth hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#b99a70_0%,#cdaa60_48%,#a08361_100%)] hover:text-ivory hover:shadow-[0_12px_24px_rgba(139,115,94,0.14)]"
                      }`
                }
              >
                {navLabel(item)}
              </Link>
            );
          })}
        </nav>

        <div
          className={
            homeAfterBanner
              ? "relative ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3 lg:ml-0"
              : "relative ml-auto flex items-center justify-end gap-1 lg:ml-0"
          }
        >
          {homeAfterBanner ? (
            <>
              <Link
                href={localizePath(routes.contact, locale)}
                className="hidden min-h-12 items-center gap-2 text-sm font-extrabold uppercase tracking-[0.02em] text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:inline-flex"
              >
                <span className="grid size-10 place-items-center rounded-full border-2 border-gold text-gold">
                  <Send className="size-5" aria-hidden="true" />
                </span>
                {locale === "vi" ? "Liên hệ nhận ưu đãi" : "Request offers"}
              </Link>
              <a
                href={`tel:${zaloContact.value}`}
                className="hidden min-h-12 items-center gap-2 text-sm font-extrabold text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:inline-flex"
              >
                <span className="grid size-10 place-items-center rounded-full border-2 border-gold text-gold">
                  <PhoneCall className="size-5" aria-hidden="true" />
                </span>
                {zaloDisplayValue()}
              </a>
            </>
          ) : null}

          <button
            type="button"
            aria-label={dictionary.header.searchLabel}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            className={
              homeAfterBanner
                ? `hidden size-11 place-items-center rounded-full border border-white/28 text-white transition hover:border-gold hover:text-gold sm:grid ${
                    searchOpen ? "border-gold bg-white/12 text-gold" : ""
                  }`
                : `relative grid size-12 place-items-center overflow-hidden rounded-[7px] text-earth shadow-[0_6px_14px_rgba(139,115,94,0.045)] transition before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.14)_45%,transparent_70%)] before:opacity-0 before:transition hover:-translate-y-0.5 hover:before:opacity-100 ${
                    searchOpen
                      ? "bg-[linear-gradient(135deg,#c1ad92_0%,#d0ba82_52%,#b9a68d_100%)] text-ivory"
                      : "bg-[linear-gradient(135deg,rgba(235,229,222,0.78)_0%,rgba(196,154,63,0.18)_48%,rgba(246,244,239,0.88)_100%)] hover:bg-[linear-gradient(135deg,#b99a70_0%,#cdaa60_48%,#a08361_100%)] hover:text-ivory"
                  }`
            }
          >
            <Search className="relative size-5" aria-hidden="true" />
          </button>
          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcher}
            showIcon={false}
            variant={homeAfterBanner ? "light" : "default"}
            className={
              homeAfterBanner
                ? "hidden md:inline-flex"
                : "hidden sm:inline-flex"
            }
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
            className={
              homeAfterBanner
                ? "inline-flex min-h-12 items-center gap-2 text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                : "grid size-11 place-items-center lg:hidden"
            }
          >
            {menuOpen ? (
              <X className={homeAfterBanner ? "size-8" : "size-5"} />
            ) : (
              <Menu className={homeAfterBanner ? "size-8" : "size-5"} />
            )}
            {homeAfterBanner ? (
              <span className="hidden text-[0.72rem] font-extrabold uppercase tracking-[0.14em] [writing-mode:vertical-rl] sm:inline">
                Menu
              </span>
            ) : null}
          </button>

          {searchOpen ? (
            <form
              id="header-search-panel"
              role="search"
              action={localizePath(routes.search, locale)}
              className={`absolute right-0 top-[calc(100%+0.85rem)] z-50 flex w-[min(28rem,calc(100vw-2.5rem))] origin-top-right animate-[searchPopoverIn_220ms_var(--ease-out-quart)_both] items-center overflow-hidden rounded-[8px] border border-earth/16 bg-ivory/96 shadow-[0_22px_60px_rgba(41,41,41,0.16)] backdrop-blur-md ${
                homeAfterBanner ? "top-[calc(100%+1.1rem)]" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-earth/35 to-transparent"
              />
              <label htmlFor="header-search-input" className="sr-only">
                {dictionary.header.searchLabel}
              </label>
              <Search
                className="ml-4 size-4.5 shrink-0 text-earth/65"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                id="header-search-input"
                name="q"
                type="search"
                placeholder={dictionary.header.searchPlaceholder}
                className="h-14 min-w-0 flex-1 bg-transparent px-3.5 text-[0.9rem] font-medium text-charcoal outline-none placeholder:text-charcoal/42"
              />
              <button
                type="submit"
                aria-label={dictionary.header.searchSubmit}
                className="mr-1 grid h-12 w-12 shrink-0 place-items-center rounded-[6px] bg-[linear-gradient(135deg,#b99a70_0%,#cdaa60_48%,#a08361_100%)] text-ivory shadow-[0_10px_20px_rgba(139,115,94,0.16)] transition hover:-translate-y-0.5 hover:bg-earth hover:shadow-[0_14px_28px_rgba(139,115,94,0.2)]"
              >
                <Search className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={dictionary.header.closeMenu}
                onClick={() => setSearchOpen(false)}
                className="mr-1 grid h-12 w-10 shrink-0 place-items-center text-charcoal/45 transition hover:text-charcoal"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`border-t ${
          homeAfterBanner
            ? "border-white/15 bg-olive/95 text-white backdrop-blur-md"
            : "border-charcoal/10 bg-ivory lg:hidden"
        } ${menuOpen ? "block" : "hidden"}`}
      >
        <nav className="mx-auto max-h-[calc(100svh-4.5rem)] max-w-site overflow-y-auto px-4 py-5 sm:px-6">
          <ul
            className={
              homeAfterBanner
                ? "divide-y divide-white/12"
                : "divide-y divide-charcoal/10"
            }
          >
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, locale)}
                  onClick={() => setMenuOpen(false)}
                  className={
                    homeAfterBanner
                      ? "my-2 flex min-h-12 items-center justify-between rounded-[6px] border border-white/16 bg-white/8 px-4 py-3 text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-white hover:border-gold hover:text-gold"
                      : "my-2 flex min-h-12 items-center justify-between rounded-[6px] border border-earth/18 bg-gold-soft/65 px-4 py-3 text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-earth"
                  }
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
                          className={
                            homeAfterBanner
                              ? "inline-flex min-h-10 items-center text-sm text-white/72 hover:text-gold"
                              : "inline-flex min-h-10 items-center text-sm text-charcoal/65 hover:text-earth"
                          }
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
            variant={homeAfterBanner ? "light" : "default"}
            className="mt-5 sm:hidden"
          />
        </nav>
      </div>
    </header>
  );
}
