"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

const topStripLinkClassName =
  "inline-flex min-w-0 items-center gap-2 text-white/90 transition hover:text-[#fdcd04]";

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function HeaderTopStrip() {
  return (
    <div className="border-b border-[#B06613]/25 bg-[#c99248]">
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
              className="mx-auto size-4 shrink-0 text-[#fdcd04] lg:mx-0"
              aria-hidden="true"
            />
            <span className="line-clamp-2 lg:line-clamp-1">{siteConfig.address}</span>
          </a>

          <div className="order-1 flex items-center justify-center gap-3 sm:gap-4 lg:order-2 lg:shrink-0">
            <a href={phoneHref} className={`${topStripLinkClassName} font-semibold`}>
              <Phone className="size-4 shrink-0 text-[#fdcd04]" aria-hidden="true" />
              <span className="whitespace-nowrap">{siteConfig.phone}</span>
            </a>

            <span
              className="hidden h-4 w-px shrink-0 bg-white/35 sm:block"
              aria-hidden="true"
            />

            <a
              href={emailHref}
              className={`${topStripLinkClassName} max-w-[11rem] min-[400px]:max-w-none`}
            >
              <Mail className="size-4 shrink-0 text-[#fdcd04]" aria-hidden="true" />
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
    };
  }, [menuOpen]);

  return (
    <header
      id="site-header"
      className="relative z-40 bg-white text-[#191919] shadow-md"
    >
      <HeaderTopStrip />

      <div className="border-b-[3px] border-[#fdcd04] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-[4.5rem] md:px-6 lg:gap-[21px]">
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

          <nav className="hidden h-full min-w-0 flex-1 items-center justify-between border-l border-[#B06613]/15 lg:flex">
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item);

              return (
                <div
                  key={item.href}
                  className="group relative flex shrink-0 items-center"
                >
                  <Link
                    href={item.href}
                    className={`nav-link-polish inline-flex h-16 items-center whitespace-nowrap border-b-[3px] px-2 text-[13px] font-bold uppercase tracking-[0.02em] xl:px-2.5 xl:text-sm md:h-[4.5rem] ${
                      active
                        ? "border-[#B06613] text-[#B06613]"
                        : "border-transparent text-[#191919] hover:border-[#B06613]/40 hover:text-[#7f4b0d]"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {item.children ? (
                    <div className="invisible absolute left-0 top-full z-50 min-w-72 opacity-0 shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-[opacity,visibility] duration-300 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="nav-dropdown-item block border-b border-[#7f4b0d]/30 bg-[#B06613] px-7 py-4 text-sm font-bold uppercase text-white last:border-b-0 hover:bg-[#7f4b0d]"
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

          <form action={routes.news} className="hidden shrink-0 items-center lg:flex">
            <label className="sr-only" htmlFor="site-search">
              Nội dung tìm kiếm
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Tìm kiếm..."
              className="h-10 w-36 border border-[#B06613]/30 bg-white px-3 text-sm text-[#191919] outline-none transition placeholder:text-[#59646a] focus:border-[#B06613] xl:w-44"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="button-polish grid h-10 w-10 place-items-center bg-[#B06613] text-white hover:bg-[#7f4b0d]"
            >
              <Search className="size-4" />
            </button>
          </form>

          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-10 place-items-center border-2 border-[#B06613]/35 text-[#7f4b0d] lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/10 bg-white px-4 pb-5 lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 py-4">
              {mainNavigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center justify-between border-b border-[#B06613]/15 text-sm font-bold uppercase text-[#191919]"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="grid border-b border-[#B06613]/15 bg-[#fff4cf]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-3 text-sm font-semibold text-[#5a3a12] hover:text-[#B06613]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <form action={routes.news} className="mx-auto flex max-w-7xl">
              <input
                name="q"
                type="search"
                placeholder="Nội dung tìm kiếm..."
                className="h-11 min-w-0 flex-1 border border-[#B06613]/30 px-4 text-sm text-[#191919] outline-none focus:border-[#B06613]"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="grid h-11 w-12 place-items-center bg-[#B06613] text-white"
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
