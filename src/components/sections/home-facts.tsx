"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const labels: Record<
  Locale,
  {
    years: string;
    projects: string;
    customers: string;
    partners: string;
  }
> = {
  vi: {
    years: "Năm hình thành & phát triển",
    projects: "Dự án đầu tư & phát triển",
    customers: "Khách hàng & cư dân đồng hành",
    partners: "Đối tác uy tín",
  },

  en: {
    years: "Years of formation & growth",
    projects: "Investment & development projects",
    customers: "Customers & residents accompanied",
    partners: "Trusted partners",
  },
};

type Fact = {
  value: number;
  suffix: string;
  label: string;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      const frame = window.requestAnimationFrame(() => setDisplayValue(value));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`} data-target={value}>
      {displayValue}
      {suffix}
    </span>
  );
}

export function HomeFacts({ locale }: { locale: Locale }) {
  const facts: Fact[] = [
    {
      value: 16,
      suffix: "+",
      label: labels[locale].years,
    },
    {
      value: 20,
      suffix: "+",
      label: labels[locale].projects,
    },
    {
      value: 1000,
      suffix: "+",
      label: labels[locale].customers,
    },
    {
      value: 50,
      suffix: "+",
      label: labels[locale].partners,
    },
  ];

  return (
    <section className="border-y border-earth/25 bg-ivory text-charcoal">
      <div className="grid w-full px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-20 lg:py-7 xl:px-28">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col items-center border-b border-earth/20 px-4 py-5 text-center sm:even:border-l lg:border-b-0 lg:border-r lg:px-8 lg:py-0 lg:even:border-l-0 lg:last:border-r-0"
          >
            <p className="font-display text-[2.625rem] font-medium leading-none text-earth sm:text-5xl lg:text-[3.25rem]">
              <AnimatedNumber value={fact.value} suffix={fact.suffix} />
            </p>

            <p className="mt-3 text-[0.72rem] font-bold uppercase leading-[1.45] text-charcoal/65">
              {fact.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
