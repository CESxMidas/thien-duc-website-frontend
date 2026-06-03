import Link from "next/link";

export function HomeHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#9b7a34]">
          Website FE moi
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          Nen tang Next.js cho website gioi thieu cong ty va du an.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#59646a]">
          Project da duoc setup voi Next.js App Router, TypeScript, Tailwind CSS
          va ESLint. Day la man hinh khoi dau de phat trien giao dien chinh thuc
          cho Thien Duc.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/du-an"
            className="inline-flex h-11 items-center bg-[#9b7a34] px-5 text-sm font-semibold text-white transition hover:bg-[#7f6127]"
          >
            Xem du an
          </Link>
          <Link
            href="/lien-he"
            className="inline-flex h-11 items-center border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-[#9b7a34] hover:text-[#9b7a34]"
          >
            Lien he
          </Link>
        </div>
      </div>

      <div className="border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Stack hien tai</h2>
        <dl className="mt-6 grid gap-4 text-sm">
          {[
            ["Framework", "Next.js App Router"],
            ["Language", "TypeScript"],
            ["Styling", "Tailwind CSS"],
            ["Quality", "ESLint"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-black/10 pb-3 last:border-b-0 last:pb-0"
            >
              <dt className="text-[#59646a]">{label}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
