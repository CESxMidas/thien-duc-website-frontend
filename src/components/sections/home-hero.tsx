import Link from "next/link";
import { homeHero, homeStrengths } from "@/data/home";

export function HomeHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
          {homeHero.eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {homeHero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#59646a]">
          {homeHero.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={homeHero.primaryCta.href}
            className="inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white transition hover:bg-[#7f4b0d]"
          >
            {homeHero.primaryCta.label}
          </Link>
          <Link
            href={homeHero.secondaryCta.href}
            className="inline-flex h-11 items-center border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-[#B06613] hover:text-[#B06613]"
          >
            {homeHero.secondaryCta.label}
          </Link>
        </div>
      </div>

      <div className="border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Năng lực trọng tâm</h2>
        <div className="mt-6 grid gap-4 text-sm">
          {homeStrengths.map((item) => (
            <div
              key={item.title}
              className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 leading-6 text-[#59646a]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
