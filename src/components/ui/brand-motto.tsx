/**
 * Phương châm thương hiệu — "Khách hàng hài lòng — Thiên Đức thành công".
 *
 * Trước đây câu này bị đặt như một dòng chú thích in nghiêng 14px ở footer và
 * một blockquote thường ở trang giới thiệu, đọc như trích dẫn phụ. Nay gom về
 * **một** component để cả site hiển thị giống nhau và đủ đậm:
 *
 * - Câu gồm hai vế nhân — quả (khách hàng hài lòng → Thiên Đức thành công), nên
 *   tách hai vế xuống hai dòng. Vế kết quả tô vàng thương hiệu để mắt dừng đúng
 *   chỗ. Phân vế thể hiện bằng **xuống dòng + tương phản màu**, không dùng vạch
 *   trang trí: bản trước chèn một vạch vàng ở giữa, đọc ra như đồ trang sức thừa
 *   giữa hai vế của một câu liền mạch.
 * - Chữ dùng `font-display` (Playfair) cỡ lớn — khác hẳn body sans xung quanh.
 */
/**
 * Tách phương châm quanh dấu gạch ngang phân vế (em/en dash, hoặc "-" có khoảng
 * trắng hai bên). Không tìm thấy dấu → trả về một vế duy nhất, khối vẫn render
 * bình thường thay vì vỡ bố cục.
 */
function splitMotto(motto: string) {
  const [first, ...rest] = motto.split(/\s*[—–]\s*|\s+-\s+/);
  return { first: first.trim(), second: rest.join(" ").trim() || undefined };
}

type BrandMottoProps = {
  motto: string;
  /** Nhãn eyebrow — chỉ dùng ở biến thể `statement`. */
  label?: string;
  className?: string;
};

/**
 * Biến thể lớn: tấm biển nền nâu đậm dùng trong nội dung trang (trang giới
 * thiệu). Nằm giữa các khối nền trắng nên tự bật lên mà không cần viền dày.
 */
export function BrandMotto({ motto, label, className }: BrandMottoProps) {
  const { first, second } = splitMotto(motto);

  return (
    <figure
      // Khối này nay nằm trong CỘT TRÁI hẹp (đã trừ rail 19rem) chứ không còn
      // chiếm nửa trang như lúc mới dựng. Padding và cỡ chữ hạ một nấc để nó
      // không đội chiều cao cả khối tổng quan lên — nội dung giữ nguyên.
      className={`relative overflow-hidden bg-brand-dark px-6 py-6 text-white shadow-[0_16px_40px_rgba(127,75,13,0.18)] sm:px-8 sm:py-8 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-gold"
      />

      {label ? (
        <figcaption className="text-eyebrow text-gold-soft">{label}</figcaption>
      ) : null}

      <blockquote
        // 20→24px thay vì 24→36px: ở cột hẹp, cỡ cũ khiến MỖI vế xuống 2 dòng
        // (4 dòng cho cả câu). Cỡ này giữ mỗi vế gọn trong một dòng — vẫn đủ to
        // để nổi hẳn so với body sans xung quanh.
        className={`font-display text-xl font-bold leading-[1.15] tracking-tight sm:text-2xl ${label ? "mt-3" : ""}`}
      >
        <span className="block text-balance">{first}</span>
        {second ? (
          <span className="mt-1 block text-balance text-gold">{second}</span>
        ) : null}
      </blockquote>
    </figure>
  );
}

/**
 * Biến thể gọn cho footer: nền đã là nâu đậm nên bỏ tấm biển, phân vế bằng
 * tương phản trắng/vàng. Không vạch trang trí — cả vạch vàng giữa hai vế lẫn
 * đường kẻ phía trên khối đều đã bỏ; khoảng cách với đoạn tagline phía trên do
 * `className` bên ngoài (`mt-5` ở footer) quản, đủ tách nhóm mà không cần kẻ.
 */
export function BrandMottoCompact({ motto, className }: BrandMottoProps) {
  const { first, second } = splitMotto(motto);

  return (
    <blockquote
      className={`font-display text-lg font-bold leading-snug text-white sm:text-xl ${className ?? ""}`}
    >
      <span className="block">{first}</span>
      {second ? (
        <span className="mt-1 block text-gold">{second}</span>
      ) : null}
    </blockquote>
  );
}
