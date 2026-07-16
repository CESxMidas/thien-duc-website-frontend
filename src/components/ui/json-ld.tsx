/**
 * Thẻ script JSON-LD dùng chung (task →7) — gom `dangerouslySetInnerHTML` về
 * một chỗ thay vì lặp ở từng nơi nhúng schema. `JSON.stringify` với dữ liệu do
 * ta dựng (không phải HTML người dùng) là an toàn cho ngữ cảnh script này.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
