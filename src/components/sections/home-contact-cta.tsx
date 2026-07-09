import Link from "next/link";
import { CtaContactCards } from "@/components/ui/cta-contact-cards";
import { homeContactCta } from "@/data/home";

export function HomeContactCta() {
  return (
    <section className="reveal-section mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 rounded-sm bg-brand-soft p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:grid-cols-[1fr_0.9fr] md:p-10">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {homeContactCta.eyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {homeContactCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {homeContactCta.description}
          </p>
          <Link
            href="/lien-he"
            className="button-polish mt-7 inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Liên hệ tư vấn
          </Link>
        </div>

        <CtaContactCards />
      </div>
    </section>
  );
}
