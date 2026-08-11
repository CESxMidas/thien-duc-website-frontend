import Link from "next/link";
import { Check } from "lucide-react";
import type { NewsCategory } from "@/types/content";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

type NewsCategoryFilterProps = {
  categories: NewsCategory[];
  /** Slug đang chọn; `undefined` nghĩa là đang ở "Tất cả". */
  activeSlug?: string;
  locale: Locale;
  allLabel: string;
  /** Nhãn a11y cho vùng lọc — trình đọc màn hình cần biết nhóm link này là gì. */
  regionLabel: string;
};

/**
 * Bộ lọc chuyên mục tin — hàng **liên kết** dạng chip.
 *
 * Là `<Link>` chứ không phải `<button>`: mỗi chuyên mục là một URL thật
 * (`/tin-tuc/danh-muc/<slug>`), nên phải mở được ở tab mới, sao chép được, bò
 * được và hoạt động đúng với nút Back/Forward mà không cần state phía client.
 *
 * KHÔNG dùng `role="tablist"`/`aria-selected`: ngữ nghĩa tab dành cho việc đổi
 * nội dung **trong cùng một trang**. Ở đây điều hướng sang trang khác, nên
 * trạng thái đang chọn diễn đạt bằng `aria-current="page"` — đúng thứ trình đọc
 * màn hình đã hiểu, không phải ARIA thừa.
 *
 * Cố ý CHƯA hiện số bài mỗi chuyên mục: backend chưa đếm riêng bài đã đăng nên
 * con số sẽ tính cả bài nháp. Thà không có số còn hơn có số sai.
 */
export function NewsCategoryFilter({
  categories,
  activeSlug,
  locale,
  allLabel,
  regionLabel,
}: NewsCategoryFilterProps) {
  // Không có chuyên mục nào thì không render khung lọc rỗng.
  if (categories.length === 0) return null;

  const items = [
    { slug: undefined, name: allLabel, href: routes.news },
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      href: `${routes.newsCategory}/${category.slug}`,
    })),
  ];

  return (
    <nav
      aria-label={regionLabel}
      data-testid="news-category-filter"
      // `flex-wrap` chứ không cuộn ngang: số chuyên mục ít và cố định, cho
      // xuống dòng thì mọi lựa chọn đều nhìn thấy được ở mobile, không có mục
      // nào bị giấu sau mép màn hình.
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => {
        const active = item.slug === activeSlug;

        return (
          <Link
            key={item.slug ?? "all"}
            href={localizePath(item.href, locale)}
            aria-current={active ? "page" : undefined}
            // `min-h-11` = 44px, khớp `.button-polish` và ngưỡng vùng chạm.
            className={`button-polish inline-flex min-h-11 items-center gap-1.5 border px-4 text-sm font-semibold transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-black/10 bg-white text-ink-soft hover:border-brand hover:text-brand"
            }`}
          >
            {active ? (
              <Check className="size-4 shrink-0" aria-hidden="true" />
            ) : null}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
