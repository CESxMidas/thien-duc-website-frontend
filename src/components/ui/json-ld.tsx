import { serializeJsonLd } from "@/lib/json-ld";

/**
 * Thẻ script JSON-LD dùng chung (task →7) — gom `dangerouslySetInnerHTML` về
 * một chỗ thay vì lặp ở từng nơi nhúng schema.
 *
 * **Sửa AUDIT-M2 / XSS-01:** chú thích cũ nói dữ liệu "do ta dựng (không phải
 * HTML người dùng)" nên `JSON.stringify` là an toàn — điều đó SAI. Schema có
 * nhúng chữ do người dùng CMS nhập (`headline` = tiêu đề tin, `description` =
 * tóm tắt, `name` = nhãn breadcrumb), và `JSON.stringify` không escape `<`, nên
 * `</script>` trong tiêu đề thoát được khỏi thẻ script. Nay đi qua
 * `serializeJsonLd` — xem lý giải đầy đủ ở `lib/json-ld.ts`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
