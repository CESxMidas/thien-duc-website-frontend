import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Handshake, ShieldCheck, Star } from "lucide-react";
import { homeHero, homeStrengths } from "@/data/home";

const strengthIcons = [Building2, Handshake, Star, ShieldCheck];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex h-11 items-center gap-3 bg-[#B06613] px-5 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_8px_24px_rgba(176,102,19,0.22)]">
      {children}
    </p>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f6f3ee_0%,#fff9ec_45%,#f6f3ee_100%)]">
      <div
        className="hero-accent-grow pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#fdcd04]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-24 top-8 size-64 rounded-full bg-[#fdcd04]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full bg-[#B06613]/8 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-x-10 gap-y-5 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_1fr] lg:items-start">
        <div className="hero-fade-up order-1 lg:col-start-1 lg:row-start-1">
          <SectionEyebrow>{homeHero.eyebrow}</SectionEyebrow>
        </div>

        <div className="hero-fade-up order-3 [animation-delay:180ms] lg:col-start-2 lg:row-start-1 lg:flex lg:justify-start">
          <SectionEyebrow>Năng lực trọng tâm</SectionEyebrow>
        </div>

        <div className="order-2 lg:col-start-1 lg:row-start-2">
          <h1 className="hero-fade-up max-w-3xl text-4xl font-semibold leading-tight text-[#191919] [animation-delay:120ms] md:text-6xl">
            {homeHero.title}
          </h1>
          <p className="hero-fade-up mt-3 max-w-2xl border-l-4 border-[#fdcd04] bg-white/70 py-1 pl-5 text-lg leading-8 text-[#59646a] [animation-delay:260ms]">
            {homeHero.description}
          </p>
          <div className="hero-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:400ms]">
            <Link
              href={homeHero.primaryCta.href}
              className="button-polish inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(176,102,19,0.28)] transition hover:bg-[#7f4b0d]"
            >
              {homeHero.primaryCta.label}
            </Link>
            <Link
              href={homeHero.secondaryCta.href}
              className="button-polish inline-flex h-11 items-center border border-[#B06613]/35 bg-white px-5 text-sm font-semibold text-[#7f4b0d] transition hover:border-[#B06613] hover:bg-[#fff8ea]"
            >
              {homeHero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="hero-fade-up order-4 overflow-hidden border border-[#B06613]/15 bg-white shadow-[0_20px_48px_rgba(25,25,25,0.08)] [animation-delay:300ms] lg:col-start-2 lg:row-start-2">
          <div className="grid gap-0 p-2 sm:p-3">
            {homeStrengths.map((item, index) => {
              const Icon = strengthIcons[index];

              return (
                <div
                  key={item.title}
                  className="hero-card-in strength-row group flex gap-4 border-b border-[#f0e6d6] p-4 last:border-b-0"
                  style={{ animationDelay: `${420 + index * 120}ms` }}
                >
                  <div className="icon-badge flex size-11 shrink-0 items-center justify-center bg-[#fff4cf] text-[#B06613] group-hover:bg-[#fdcd04] group-hover:text-[#191919]">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="inline-block border-b-2 border-[#fdcd04]/80 pb-0.5 font-bold text-[#B06613]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#59646a]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
