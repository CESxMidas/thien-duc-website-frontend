import { Building2, Handshake, ShieldCheck, Star } from "lucide-react";
import { homeHero, homeStrengths } from "@/data/home";

const strengthIcons = [Building2, Handshake, Star, ShieldCheck];

/**
 * Dải giới thiệu rút gọn thay cho hero cũ (H1 + CTA đã dời lên banner slider
 * theo UI-UX-HANDOFF-SPEC.md mục H1). Mục tiêu chiều cao ≤ 50vh.
 */
export function HomeIntroStrip() {
  return (
    <section className="relative overflow-hidden border-y border-brand/10 bg-linear-to-br from-surface-warm via-cream to-surface-warm">
      <div
        className="hero-accent-grow pointer-events-none absolute inset-y-0 left-0 w-1 bg-gold"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <p className="inline-flex min-h-11 items-center gap-3 bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(176,102,19,0.22)] sm:px-5 sm:text-sm sm:tracking-[0.24em]">
            {homeHero.eyebrow}
          </p>
          <p className="mt-6 border-l-4 border-gold bg-white/70 py-1 pl-5 text-base leading-8 text-slate lg:text-lg">
            {homeHero.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeStrengths.map((item, index) => {
            const Icon = strengthIcons[index];

            return (
              <div
                key={item.title}
                className="strength-row group border border-brand/15 bg-white p-5 shadow-[0_10px_28px_rgba(25,25,25,0.05)]"
              >
                <div className="icon-badge flex size-11 shrink-0 items-center justify-center bg-gold-soft text-brand group-hover:bg-gold group-hover:text-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 inline-block border-b-2 border-gold/80 pb-0.5 text-base font-bold text-brand">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
