"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { mainNavigation } from "@/data/navigation";
import { localizePath, splitLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

const primaryNavigation = mainNavigation.filter((item) =>
  ["/", "/gioi-thieu", "/du-an", "/tin-tuc", "/lien-he"].includes(item.href),
);

function isActive(path: string, item: NavItem) {
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
  const navLabel = (item: NavItem) =>
    dictionary.navLabels[item.href] ?? item.label;

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 border-b border-charcoal/12 bg-ivory/95 text-charcoal"
    >
      <div className="mx-auto flex h-18 max-w-header items-center px-4 sm:px-6 lg:h-20">
        <Link
          href={localizePath(routes.home, locale)}
          className="flex shrink-0 items-center gap-3"
          aria-label={dictionary.shared.homeAriaLabel}
        >
          <Image
            src="/images/brand/logo-thien-duc.png"
            alt={dictionary.shared.logoAlt}
            width={52}
            height={52}
            preload
            className="size-11 object-contain lg:size-12"
          />
          <span className="hidden border-l border-charcoal/15 pl-3 font-display text-xl font-semibold tracking-[0.03em] xl:block">
            {dictionary.shared.companyName}
          </span>
        </Link>

        <nav className="ml-auto hidden h-full items-center lg:flex" aria-label="Primary">
          {primaryNavigation.map((item) => {
            const active = isActive(path, item);
            return (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                aria-current={active ? "page" : undefined}
                className={`flex h-full items-center border-b-2 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors xl:px-4 ${
                  active
                    ? "border-earth text-earth"
                    : "border-transparent text-charcoal/75 hover:border-earth/45 hover:text-charcoal"
                }`}
              >
                {navLabel(item)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
          <Link
            href={localizePath(routes.search, locale)}
            aria-label={dictionary.header.searchLabel}
            className="grid size-11 place-items-center text-charcoal/70 transition-colors hover:text-earth"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </Link>
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
            aria-label={menuOpen ? dictionary.header.closeMenu : dictionary.header.openMenu}
            className="grid size-11 place-items-center lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
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
                  className="flex min-h-12 items-center justify-between py-3 text-sm font-semibold uppercase tracking-[0.12em]"
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
