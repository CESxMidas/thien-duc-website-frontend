import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ZaloContactLink } from "@/components/ui/zalo-contact-link";
import { zaloHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type SiteShellProps = {
  locale: Locale;
  children: ReactNode;
  /**
   * Cho phép một trang TẮT hẳn nút Zalo nổi (không render, không chỉ ẩn bằng
   * CSS). Dùng cho `/lien-he`: trang đó đã có kênh Zalo nội dòng ngay cạnh số
   * điện thoại, nên nút nổi vừa thừa vừa đè lên ô nhập của biểu mẫu.
   */
  showFloatingContact?: boolean;
};

/**
 * Server Component: nạp dictionary một lần rồi truyền xuống header/footer
 * (client) qua props — tránh bundle cả hai file dịch vào JS phía trình duyệt.
 */
export async function SiteShell({
  locale,
  children,
  showFloatingContact = true,
}: SiteShellProps) {
  const dictionary = await getDictionary(locale);

  return (
    // `flex flex-col` là bắt buộc: `mt-auto` trên <footer> chỉ có tác dụng khi
    // cha là flex container. Thiếu nó, trang ngắn hơn viewport để lộ một dải nền
    // `bg-surface-warm` trống bên **dưới** footer (div vẫn cao min-h-screen).
    // `flex-1` cho <main> đẩy footer xuống đáy mà không cần chiều cao cố định.
    <div className="flex min-h-screen flex-col bg-surface-warm text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
      {/* Đặt SAU footer trong DOM: nút nổi là chặng tab cuối, không chen vào
          giữa nội dung chính. Nó `fixed z-30` nên vẫn nằm dưới header sticky
          (z-40) và dưới overlay menu mobile — mở drawer là nút bị che đúng như
          thiết kế, không cần thêm state hay khung modal mới. */}
      {showFloatingContact ? (
        <ZaloContactLink
          variant="floating"
          href={zaloHref()}
          ariaLabel={dictionary.zalo.ariaLabel}
          label={dictionary.zalo.label}
        />
      ) : null}
    </div>
  );
}
