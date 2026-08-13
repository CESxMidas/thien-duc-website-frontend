import { ZaloIcon } from "@/components/ui/zalo-icon";

type ZaloContactLinkProps = {
  /** URL đã dựng sẵn (`zaloHref`) — component KHÔNG tự đọc config để sau này
      thay bằng dữ liệu CMS chỉ cần đổi nơi truyền prop. */
  href: string;
  /** Tên truy cập đầy đủ, vd. "Liên hệ Thiên Đức qua Zalo". */
  ariaLabel: string;
  /** Nhãn kênh ("Zalo") — dùng cho `sr-only` ở biến thể inline. */
  label: string;
  variant: "floating" | "inline";
  /** Chỉ dùng ở biến thể inline: số hiển thị `0941 383 007`. OA không có số
      thì bỏ trống, khối chỉ còn wordmark + nhãn. */
  displayValue?: string;
  className?: string;
  iconClassName?: string;
  /** Style của phần số hiển thị, để khớp với các dòng liên hệ xung quanh
      (footer dùng chữ trắng đậm, trang liên hệ dùng màu brand). */
  valueClassName?: string;
};

/**
 * Biến thể nổi (`floating`) neo cố định ở rail phải.
 *
 * `bottom: 80px` là ràng buộc chống va chạm có chủ ý, không phải số làm tròn
 * cho đẹp: cụm nút Tạm dừng / Tiến / Lùi của banner trang chủ chiếm khoảng
 * 20px → 64px tính từ đáy khung nhìn ở MỌI breakpoint (nút tạm dừng luôn
 * `size-11`). 80px chừa khoảng hở ~16px nên nút Zalo không bao giờ che cơ chế
 * dừng autoplay — đó là yêu cầu WCAG 2.2.2 mức A, không phải chuyện thẩm mỹ.
 * Đổi số này phải đo lại cụm nút banner trước.
 *
 * `env(safe-area-inset-bottom)` cộng thêm để trên máy có notch/thanh gesture
 * nút vẫn nằm trên vùng an toàn.
 */
const floatingClassName = [
  // `floating-zalo` là móc cho quy tắc trong `globals.css` gỡ nút khỏi tab
  // order khi drawer mobile mở.
  "floating-zalo",
  "fixed left-5 bottom-[calc(20px+env(safe-area-inset-bottom))] z-30",
  // Vòng tròn 44×44 ở mobile; từ `md` giãn thành viên thuốc có wordmark lớn hơn.
  "inline-flex h-11 w-11 items-center justify-center rounded-full md:h-11 md:w-auto md:gap-2 md:rounded-full md:px-5",
  // Xanh Zalo chính thức + chữ trắng: giữ nhận diện của dịch vụ bên thứ ba,
  // không nhuộm sang nâu/vàng thương hiệu.
  "bg-[#0068ff] text-white shadow-[0_4px_16px_rgba(0,104,255,0.32)]",
  // Chỉ chuyển động NỀN. `transition-colors` gộp cả `outline-color`, khiến viền
  // focus mờ dần từ `currentColor` (trắng) trong 200ms — đo được là viền gần
  // như tàng hình ngay lúc vừa Tab tới, đúng khoảnh khắc cần thấy nó nhất.
  "transition-[background-color] duration-200 hover:bg-[#0052cc] motion-reduce:transition-none",
  // Viền focus HAI LỚP, vì nút trôi trên đủ loại nền: vòng trắng ôm sát (qua
  // box-shadow) + viền nâu `brand` ở ngoài. Trên nền kem thì viền nâu nổi
  // (5.9:1), trên footer nâu đậm thì vòng trắng nổi — luôn còn ít nhất một
  // ranh giới tương phản cao. Một màu đơn không đủ: đã đo nâu/nâu đậm chỉ
  // 1.3:1, vàng/kem chỉ 1.4:1.
  //
  // Màu viền phải đặt TƯỜNG MINH bằng token: quy tắc `:focus-visible` toàn cục
  // biên dịch ra mất `outline-color` nên rơi về `currentColor` — với nút chữ
  // trắng này là viền trắng, tàng hình trên nền sáng (đã đo trong trình duyệt).
  // Dùng token chứ không dùng hex tuỳ ý: `outline-[#…]` biên dịch hụt.
  // `outline-offset-4` (giá trị trong thang) chứ không phải `-[3px]` tuỳ ý —
  // bản tuỳ ý biên dịch hụt, viền rơi về offset 2px và đè lên vòng trắng.
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
  "focus-visible:shadow-[0_0_0_3px_#ffffff,0_4px_16px_rgba(0,104,255,0.32)]",
].join(" ");

export function ZaloContactLink({
  href,
  ariaLabel,
  label,
  variant,
  displayValue,
  className,
  iconClassName,
  valueClassName,
}: ZaloContactLinkProps) {
  // `_blank` vì trên desktop `zalo.me/<số>` chuyển hướng sang trang đăng nhập
  // Zalo — không được cuốn mất trang Thiên Đức đang mở. `noopener noreferrer`
  // đi kèm bắt buộc.
  const common = {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": ariaLabel,
  } as const;

  if (variant === "floating") {
    return (
      <a {...common} className={`${floatingClassName} ${className ?? ""}`}>
        {/* Wordmark chính là chữ "Zalo" hiện trên nút — không kèm thêm một
            `<span>Zalo</span>` nữa, sẽ thành "Zalo Zalo". Mobile thu nhỏ cho
            lọt vòng tròn, `md` phóng to trong viên thuốc. */}
        <ZaloIcon
          className={`h-2.5 w-auto md:h-3.5 ${iconClassName ?? ""}`}
        />
      </a>
    );
  }

  return (
    <a {...common} className={className}>
      <ZaloIcon className={iconClassName} />
      <span className="min-w-0">
        <span className="sr-only">{label}: </span>
        {displayValue ? (
          <span className={valueClassName}>{displayValue}</span>
        ) : null}
      </span>
    </a>
  );
}
