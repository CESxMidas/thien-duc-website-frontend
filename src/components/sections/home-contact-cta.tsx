import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { homeContactCta } from "@/data/home";

export function HomeContactCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 bg-[#191919] p-6 text-white md:grid-cols-[1fr_0.9fr] md:p-10">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
            {homeContactCta.eyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {homeContactCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            {homeContactCta.description}
          </p>
          <Link
            href="/lien-he"
            className="mt-7 inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white"
          >
            Liên hệ tư vấn
          </Link>
        </div>

        <div className="grid content-center gap-4 text-sm">
          <a
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
            className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
          >
            <Phone className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
            <span>
              <span className="block text-white/60">Điện thoại</span>
              <span className="mt-1 block font-semibold">{siteConfig.phone}</span>
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
          >
            <Mail className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
            <span>
              <span className="block text-white/60">Email</span>
              <span className="mt-1 block font-semibold">{siteConfig.email}</span>
            </span>
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
          >
            <MapPin className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
            <span>
              <span className="block text-white/60">Trụ sở</span>
              <span className="mt-1 block font-semibold">{siteConfig.address}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
