"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { useState } from "react";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import type { NavItem } from "@/types/content";

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-40 bg-white text-[#191919] shadow-md">
      <div className="border-b border-[#B06613]/25 bg-[#c99248]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 font-medium text-white/90">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-[#fdcd04]"
            >
              <MapPin className="size-4 shrink-0 text-[#fdcd04]" />
              <span>{siteConfig.address}</span>
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 transition hover:text-[#fdcd04]"
            >
              <Phone className="size-4 shrink-0 text-[#fdcd04]" />
              <span>{siteConfig.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 transition hover:text-[#fdcd04]"
            >
              <Mail className="size-4 shrink-0 text-[#fdcd04]" />
              <span>{siteConfig.email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-b-[3px] border-[#fdcd04] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)]">
        <div className="mx-auto flex max-w-7xl items-stretch justify-between px-4 md:px-6">
          <Link
            href="/"
            className="my-4 flex min-h-24 w-32 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white p-3 shadow-sm md:w-36"
            aria-label="Trang chủ Thiên Đức"
          >
            <Image
              src="/images/brand/logo-thien-duc.png"
              alt="Logo Thiên Đức"
              width={120}
              height={96}
              preload
              className="h-24 w-auto object-contain"
            />
          </Link>

          <div className="hidden flex-1 items-end justify-end gap-4 lg:flex">
            <nav className="flex items-center self-stretch">
              {mainNavigation.map((item) => {
                const active = isActive(pathname, item);

                return (
                  <div
                    key={item.href}
                    className="group relative flex items-center"
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex h-full items-center border-b-[3px] px-3 text-sm font-bold uppercase tracking-[0.02em] transition ${
                        active
                          ? "border-[#B06613] text-[#B06613]"
                          : "border-transparent text-[#191919] hover:border-[#B06613]/40 hover:text-[#7f4b0d]"
                      }`}
                    >
                      {item.label}
                    </Link>

                    {item.children ? (
                      <div className="invisible absolute left-0 top-full min-w-72 opacity-0 shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block border-b border-[#7f4b0d]/30 bg-[#B06613] px-7 py-4 text-sm font-bold uppercase text-white transition last:border-b-0 hover:bg-[#7f4b0d]"
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

            <form action={routes.news} className="flex items-center self-center">
              <label className="sr-only" htmlFor="site-search">
                Nội dung tìm kiếm
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Nội dung tìm kiếm..."
                className="h-11 w-52 border border-[#B06613]/30 bg-white px-4 text-sm text-[#191919] outline-none transition placeholder:text-[#59646a] focus:border-[#B06613]"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="grid h-11 w-12 place-items-center bg-[#B06613] text-white transition hover:bg-[#7f4b0d]"
              >
                <Search className="size-5" />
              </button>
            </form>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="my-auto grid size-11 place-items-center border-2 border-[#B06613]/35 text-[#7f4b0d] lg:hidden"
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
