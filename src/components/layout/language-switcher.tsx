"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  localeNameIn,
  locales,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  className?: string;

  showIcon?: boolean;
  variant?: "default" | "light";
};

export function LanguageSwitcher({
  locale,
  label,
  className = "",
  showIcon = true,
  variant = "default",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);

  return (
    <div
     
      className={`inline-flex h-10 items-center gap-2 ${className}`}
      role="group"
      aria-label={label}
    >
      {showIcon ? <span className="mr-1 text-warm-grey" aria-hidden="true">/</span> : null}
      {locales.map((item, index) => {
        const active = item === locale;
        const linkClass =
          variant === "light"
            ? active
              ? "text-gold"
              : "text-white/72 hover:text-white"
            : active
              ? "text-earth"
              : "text-charcoal/55 hover:text-charcoal";
        const dividerClass =
          variant === "light" ? "text-white/38" : "text-charcoal/35";

        return (
          <span key={item} className="inline-flex h-full items-center gap-2">
            {index > 0 ? (
              <span className={dividerClass} aria-hidden="true">
                |
              </span>
            ) : null}
            <Link
              href={localizePath(path, item)}
              hrefLang={item}
              aria-current={active ? "true" : undefined}
              className={`inline-flex h-full items-center text-xs font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth ${linkClass}`}
            >
              <span className="sr-only">{localeNameIn[locale][item]}</span>
              <span aria-hidden="true">{item}</span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
