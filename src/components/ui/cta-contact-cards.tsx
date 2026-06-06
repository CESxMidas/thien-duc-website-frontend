import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

const cardClassName =
  "flex gap-3 rounded border border-[#B06613]/30 bg-[#fff4cf] p-4 text-[#191919] shadow-[0_4px_14px_rgba(127,75,13,0.16)] transition hover:border-[#B06613] hover:bg-[#fdcd04]";

export function CtaContactCards() {
  return (
    <div className="grid content-center gap-4 text-sm">
      <a
        href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
        className={cardClassName}
      >
        <Phone className="mt-0.5 size-5 shrink-0 text-[#B06613]" />
        <span>
          <span className="block text-[#59646a]">Điện thoại</span>
          <span className="mt-1 block font-semibold text-[#191919]">
            {siteConfig.phone}
          </span>
        </span>
      </a>
      <a href={`mailto:${siteConfig.email}`} className={cardClassName}>
        <Mail className="mt-0.5 size-5 shrink-0 text-[#B06613]" />
        <span>
          <span className="block text-[#59646a]">Email</span>
          <span className="mt-1 block font-semibold text-[#191919]">
            {siteConfig.email}
          </span>
        </span>
      </a>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        <MapPin className="mt-0.5 size-5 shrink-0 text-[#B06613]" />
        <span>
          <span className="block text-[#59646a]">Trụ sở</span>
          <span className="mt-1 block font-semibold text-[#191919]">
            {siteConfig.address}
          </span>
        </span>
      </a>
    </div>
  );
}
