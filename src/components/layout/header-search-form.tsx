import { Search } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type HeaderSearchFormProps = {
  /** Đích submit đã kèm tiền tố locale (`/tin-tuc` hoặc `/en/tin-tuc`). */
  action: string;
  labels: Dictionary["header"];
  /**
   * `id` của ô nhập. Bắt buộc truyền vào vì bản desktop và bản trong drawer
   * **cùng tồn tại trong DOM** (một bản bị `display:none`) — trùng `id` sẽ khiến
   * `<label htmlFor>` trỏ nhầm phần tử.
   */
  inputId: string;
  /**
   * Khác biệt trình bày duy nhất được phép: thuộc tính `display` + bề rộng.
   * Component KHÔNG tự khai `flex`/`hidden` để lớp gọi quyết định breakpoint —
   * hai utility `display` cùng độ ưu tiên, trộn chung sẽ thắng thua theo thứ tự
   * trong stylesheet chứ không theo thứ tự viết trong `class`.
   */
  className?: string;
};

/**
 * Ô tìm kiếm ở header — **một nguồn duy nhất** cho cả desktop lẫn drawer mobile.
 *
 * Trước đây hai chỗ chép tay hai bản riêng và đã trôi lệch nhau: bản mobile mất
 * hẳn `<label>` (trình đọc màn hình chỉ đọc "edit text, blank"), hai bản khác
 * chiều cao và khác bề rộng nút. Gộp lại để lỗi đó không thể tái diễn.
 *
 * Bố cục là **một đường viền chung** bọc: icon kính lúp (trang trí) → ô nhập
 * không viền, nền trong suốt → nút gửi. Ô nhập cố ý không có hộp riêng, nên
 * người dùng thấy một control liền mạch thay vì hai hình chữ nhật rời.
 *
 * Không có state, không `useEffect`, không gọi mạng khi gõ: form GET thuần,
 * Enter và nút bấm đều submit theo cơ chế sẵn có của trình duyệt.
 */
export function HeaderSearchForm({
  action,
  labels,
  inputId,
  className = "",
}: HeaderSearchFormProps) {
  return (
    <form
      // `role="search"` cho phép nhảy thẳng tới ô tìm kiếm bằng phím tắt của
      // trình đọc màn hình. Chỉ đúng MỘT bản hiển thị ở mỗi breakpoint (bản kia
      // `display:none` nên không lộ ra cây trợ năng) — không sinh landmark trùng.
      role="search"
      action={action}
      className={`search-field h-11 items-center overflow-hidden rounded-md border border-brand/30 bg-white transition-colors ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        {labels.searchLabel}
      </label>
      {/* Ô chỉ còn MỘT biểu tượng kính lúp — nằm trong nút gửi. Bản cũ có thêm
          một kính lúp trang trí ở đầu ô: hai icon cùng nghĩa, mà 36px nó chiếm
          lại là phần placeholder cần để hiện đủ chữ. Ở `lg` ô chỉ rộng 176px
          nên "Tìm tin tức" bị nút "TÌM" cắt mất đuôi (nhãn EN "Search" còn dài
          hơn). Nút icon vuông 44px vừa trả chỗ cho chữ, vừa giữ vùng chạm ≥44px
          và khối màu thương hiệu. */}
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder={labels.searchPlaceholder}
        className="h-full min-w-0 flex-1 bg-transparent pl-3 text-sm text-ink placeholder:text-slate"
      />
      <button
        type="submit"
        aria-label={labels.searchSubmit}
        className="button-polish grid h-full w-11 shrink-0 place-items-center bg-brand text-white transition-colors hover:bg-brand-dark"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
