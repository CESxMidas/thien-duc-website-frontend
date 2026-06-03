"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe2, Mail, MapPin, Menu, Moon, Phone, Search, X } from "lucide-react";
import { useState } from "react";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import type { NavItem } from "@/types/content";

const socialLinks = [
  { label: "Pinterest", text: "P", href: "#" },
  { label: "LinkedIn", text: "in", href: "#" },
  { label: "Google Plus", text: "g+", href: "#" },
  { label: "Facebook", text: "f", href: "#" },
  { label: "Twitter", text: "t", href: "#" },
];

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
    <header className="relative z-40 bg-white text-[#191919] shadow-sm">
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[#1f2529]">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-[#B06613]"
            >
              <MapPin className="size-4 text-[#B06613]" />
              <span>{siteConfig.address}</span>
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 transition hover:text-[#B06613]"
            >
              <Phone className="size-4 text-[#B06613]" />
              <span>{siteConfig.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 transition hover:text-[#B06613]"
            >
              <Mail className="size-4 text-[#B06613]" />
              <span>{siteConfig.email}</span>
            </a>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="grid size-7 place-items-center rounded-full text-xs font-bold text-[#6c7479] transition hover:bg-[#B06613] hover:text-white"
              >
                {item.text}
              </a>
            ))}
            <button
              type="button"
              aria-label="Chế độ hiển thị"
              className="grid size-7 place-items-center rounded-full text-[#6c7479] transition hover:bg-[#B06613] hover:text-white"
            >
              <Moon className="size-4" />
            </button>
            <a
              href={siteConfig.url}
              aria-label="Website"
              className="grid size-7 place-items-center rounded-full text-[#6c7479] transition hover:bg-[#B06613] hover:text-white"
            >
              <Globe2 className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-[#fdcd04] bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
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
              priority
              className="h-24 w-auto object-contain"
            />
          </Link>

          <div className="hidden flex-1 items-end justify-end gap-4 lg:flex">
            <nav className="flex items-center self-stretch">
              {mainNavigation.map((item) => {
                const active = isActive(pathname, item);

                return (
                  <div key={item.href} className="group relative flex items-center">
                    <Link
                      href={item.href}
                      className={`inline-flex h-full items-center px-3 text-sm font-bold uppercase tracking-[0.01em] transition ${
                        active ? "text-[#B06613]" : "text-[#5a3a12] hover:text-[#B06613]"
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
                            className="block border-b border-white/20 bg-[#f3a51c] px-7 py-4 text-sm font-semibold uppercase text-white transition last:border-b-0 hover:bg-[#B06613]"
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

            <form action="/tin-tuc" className="flex items-center self-center">
              <label className="sr-only" htmlFor="site-search">
                Nội dung tìm kiếm
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Nội dung tìm kiếm..."
                className="h-11 w-52 border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-[#8c8c8c] focus:border-[#B06613]"
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
            className="my-auto grid size-11 place-items-center border border-black/10 text-[#B06613] lg:hidden"
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
                    className="flex min-h-11 items-center justify-between border-b border-black/10 text-sm font-bold uppercase text-[#5a3a12]"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="grid border-b border-black/10 bg-[#fff8ea]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-3 text-sm font-medium text-[#7b5722]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <form action="/tin-tuc" className="mx-auto flex max-w-7xl">
              <input
                name="q"
                type="search"
                placeholder="Nội dung tìm kiếm..."
                className="h-11 min-w-0 flex-1 border border-black/10 px-4 text-sm outline-none focus:border-[#B06613]"
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
