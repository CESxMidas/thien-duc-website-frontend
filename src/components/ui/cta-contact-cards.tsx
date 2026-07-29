import { Mail, MapPin, Phone } from "lucide-react";
import { displayAddress, siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

const cardClassName =
  "interactive-card flex gap-3 rounded border border-brand/30 bg-gold-soft p-4 text-ink shadow-[0_4px_14px_rgba(127,75,13,0.16)] hover:border-brand hover:bg-gold";

/**
 * Khối chữ trong thẻ là **flex item**, mà flex item mặc định `min-width: auto`
 * nên KHÔNG co được dưới bề rộng min-content. Email
 * (`dautuxaydungthienduc@yahoo.com`) là một "từ" liền không có chỗ ngắt, nên
 * min-content của nó ~254px; cộng icon + gap + padding thành sàn ~344px cho cả
 * khối CTA. Ở khung nhìn 375px, hộp nội dung chỉ còn 343px → trang tràn ngang
 * đúng 1px (vừa lọt dung sai ±1px của test) và tràn hẳn khi font render rộng
 * hơn một chút (runner Linux của CI): đo được scrollWidth 388 > innerWidth 375.
 *
 * Bản sửa dùng `wrap-anywhere` (`overflow-wrap: anywhere`) chứ KHÔNG phải
 * `wrap-break-word`: `break-word` chỉ ngắt từ khi dòng đã tràn, nó **không** làm
 * giảm bề rộng min-content, nên sàn vẫn còn (đã đo: scrollWidth vẫn 344).
 * `anywhere` thì có tính vào min-content, sàn biến mất hẳn. `min-w-0` đi kèm để
 * flex item thực sự co được. Chữ vẫn hiện đầy đủ, chỉ xuống dòng — không cắt
 * bớt, không ẩn nội dung.
 */
const valueClassName = "mt-1 block wrap-anywhere font-semibold text-ink";

type CtaContactCardsProps = {
  locale: Locale;
  labels: {
    phone: string;
    email: string;
    office: string;
  };
};

export function CtaContactCards({ locale, labels }: CtaContactCardsProps) {
  return (
    <div className="grid content-center gap-4 text-sm">
      <a
        href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
        className={cardClassName}
      >
        <Phone className="mt-0.5 size-5 shrink-0 text-brand" />
        <span className="min-w-0">
          <span className="block text-slate">{labels.phone}</span>
          <span className={valueClassName}>{siteConfig.phone}</span>
        </span>
      </a>
      <a href={`mailto:${siteConfig.email}`} className={cardClassName}>
        <Mail className="mt-0.5 size-5 shrink-0 text-brand" />
        <span className="min-w-0">
          <span className="block text-slate">{labels.email}</span>
          <span className={valueClassName}>{siteConfig.email}</span>
        </span>
      </a>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
        <span className="min-w-0">
          <span className="block text-slate">{labels.office}</span>
          <span className={valueClassName}>{displayAddress(locale)}</span>
        </span>
      </a>
    </div>
  );
}
