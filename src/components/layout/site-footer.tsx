import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  displayAddress,
  legalDisplayName,
  legalInfo,
  siteConfig,
  taxAuthorityName,
} from "@/config/site";
import { footerSections } from "@/data/footer";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-11 items-center text-sm text-white/85 transition hover:text-gold sm:min-h-0";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand/25 bg-brand-dark text-white">
      {/* Nền brand-dark (#7f4b0d) cho cả khối trên: brand-soft (#c99248) quá
          sáng khiến chữ trắng/vàng chỉ đạt ~1.8–2.7:1 (dưới ngưỡng WCAG AA).
          Đồng bộ nền nâu đậm — vốn đã khai báo ở thẻ <footer> — đưa chữ trắng
          lên ~7:1, vàng lên ~4.8:1, giữ đúng tông thương hiệu. */}
      <div className="bg-brand-dark">
        {/* Gom Liên hệ thành một cột trong hàng trên (bỏ dải full-width thưa
            thớt cũ) để lấp đầy hàng và tránh khoảng trống ngang dư thừa. */}
        {/* Padding/gap thu gọn: `py-10 sm:py-12` (40/48px) + `gap-y-9` (36px) là
            dư — với 5 hàng ở mobile, riêng row-gap đã cộng ~144px. Cột brand hạ
            từ `1.5fr` xuống `1.15fr` để bớt chênh chiều cao với 3 cột link ngắn
            (giảm dải rỗng ở nửa dưới) mà không phải độn thêm link giả. */}
        <div className="mx-auto grid max-w-site gap-x-8 gap-y-7 grid-cols-2 px-4 py-8 sm:px-6 sm:py-11 sm:gap-y-8 lg:grid-cols-[1.15fr_repeat(3,minmax(0,0.8fr))_1.2fr] lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href={localizePath(routes.home, locale)}
              className="inline-flex size-16 items-center justify-center rounded-lg border border-white/20 bg-white p-2 shadow-sm"
              aria-label={dictionary.shared.homeAriaLabel}
            >
              <Image
                src="/images/brand/logo-thien-duc.png"
                alt={dictionary.shared.logoAlt}
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </Link>
            <p className="mt-5 text-lg font-semibold">
              {dictionary.shared.companyName}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
              {dictionary.footerBrand.tagline}
            </p>
            {/* `max-w-xs` giống tagline — trước đây motto không giới hạn nên hai
                đoạn trong cùng một cột có độ dài dòng khác nhau, mép phải lởm chởm. */}
            <p className="mt-4 max-w-xs border-l-4 border-gold pl-4 text-sm font-medium italic text-gold-soft">
              {dictionary.footerBrand.motto}
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-eyebrow text-gold">
                {dictionary.footerSectionTitles[section.title] ?? section.title}
              </h2>
              <ul className="mt-3 space-y-1 sm:mt-5 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, locale)}
                      className={footerLinkClassName}
                    >
                      {dictionary.footerLabels[link.href] ?? link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-eyebrow text-gold">{dictionary.footer.contact}</h2>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-4">
              <li>
                <a href={phoneHref} className={`${footerLinkClassName} flex items-start gap-3`}>
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/75">
                      {dictionary.footer.phone}
                    </span>
                    <span className="mt-1 block font-semibold text-white">
                      {siteConfig.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={emailHref} className={`${footerLinkClassName} flex items-start gap-3`}>
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/75">
                      {dictionary.footer.email}
                    </span>
                    <span className="mt-1 block wrap-break-word font-semibold text-white">
                      {siteConfig.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`${footerLinkClassName} flex items-start gap-3`}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/75">
                      {dictionary.footer.office}
                    </span>
                    <span className="mt-1 block font-semibold leading-6 text-white">
                      {displayAddress(locale)}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            {/* CTA chuyển từ dải copyright cuối trang lên đây: nó là phần tử hành
                động duy nhất của footer, đặt ngay dưới thông tin liên hệ thì gắn
                đúng ngữ cảnh và nằm trong vùng mắt còn đọc. Đồng thời việc này
                kéo dài cột Liên hệ, cân bớt với cột brand và giải phóng dải cuối. */}
            <Link
              href={localizePath(routes.contact, locale)}
              className="mt-5 inline-flex min-h-11 items-center rounded-md border border-gold px-4 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {dictionary.common.contactCta} →
            </Link>
          </div>
        </div>
      </div>

      {/* Một dải chân duy nhất. Trước đây là hai khối riêng, mỗi khối `py-5` —
          80px padding cho 3 dòng chữ 12px, và chỉ khối trên có `border-t` nên
          ranh giới trông không nhất quán. */}
      <div className="border-t border-brand/20">
        <div className="mx-auto flex max-w-site flex-col gap-2 px-4 py-4 text-xs leading-6 text-white/75 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-[0.12em] text-white/85">
              {legalDisplayName[locale]}
            </p>
            <p>
              {dictionary.footer.taxCode}: {legalInfo.taxCode} · {taxAuthorityName[locale]}
            </p>
          </div>
          <p className="shrink-0 md:text-right">
            © {currentYear} {dictionary.shared.companyName}.{" "}
            {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
