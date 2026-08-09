"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type HeaderSearchProps = {
  action: string;
  dictionary: Dictionary;
  className?: string;
};

export function HeaderSearch({
  action,
  dictionary,
  className = "",
}: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelId = useId();
  const inputId = useId();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          open ? dictionary.header.searchClose : dictionary.header.searchOpen
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-md border border-brand/25 bg-cream/70 text-brand-dark transition-colors duration-200 hover:bg-gold-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Search className="size-5" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2.5 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-brand/15 bg-white p-2.5 shadow-[0_12px_28px_-10px_rgba(127,75,13,0.32)]"
      >
        <form action={action}>
          <label className="sr-only" htmlFor={inputId}>
            {dictionary.header.searchLabel}
          </label>

          <div className="flex h-11 items-center overflow-hidden rounded-md border border-brand/20 bg-cream/60 transition-colors duration-200 has-[input:focus-visible]:border-brand has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand/20">
            <Search
              className="ml-3 size-4 shrink-0 text-brand/60"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id={inputId}
              name="q"
              type="search"
              placeholder={dictionary.header.searchPlaceholder}
              className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-2.5 text-sm text-ink shadow-none ring-0 outline-none focus:outline-none focus-visible:outline-none placeholder:text-slate"
            />
            <button
              type="submit"
              className="h-full shrink-0 border-l border-brand-dark/25 bg-brand px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              {dictionary.header.searchSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
