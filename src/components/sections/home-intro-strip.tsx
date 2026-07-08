import { Building2, Handshake, ShieldCheck, Star } from "lucide-react";
import { homeHero, homeStrengths } from "@/data/home";

const strengthIcons = [Building2, Handshake, Star, ShieldCheck];

/**
 * Dải giới thiệu rút gọn thay cho hero cũ (H1 + CTA đã dời lên banner slider
 * theo UI-UX-HANDOFF-SPEC.md mục H1). Mục tiêu chiều cao ≤ 50vh.
 */
export function HomeIntroStrip() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f6f3ee_0%,#fff9ec_45%,#f6f3ee_100%)]">
      <div
        className="hero-accent-grow pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#fdcd04]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="inline-flex h-11 items-center gap-3 bg-[#B06613] px-5 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_8px_24px_rgba(176,102,19,0.22)]">
            {homeHero.eyebrow}
          </p>
          <p className="mt-6 border-l-4 border-[#fdcd04] bg-white/70 py-1 pl-5 text-base leading-8 text-[#59646a] lg:text-lg">
            {homeHero.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeStrengths.map((item, index) => {
            const Icon = strengthIcons[index];

            return (
              <div
                key={item.title}
                className="strength-row group border border-[#B06613]/15 bg-white p-5 shadow-[0_10px_28px_rgba(25,25,25,0.05)]"
              >
                <div className="icon-badge flex size-11 shrink-0 items-center justify-center bg-[#fff4cf] text-[#B06613] group-hover:bg-[#fdcd04] group-hover:text-[#191919]">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 inline-block border-b-2 border-[#fdcd04]/80 pb-0.5 text-base font-bold text-[#B06613]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#59646a]">
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
