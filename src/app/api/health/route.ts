import { NextResponse } from "next/server";

/**
 * Health check tối giản — dùng làm URL "sẵn sàng" cho Playwright webServer và
 * cho readiness check trong CI.
 *
 * Vì sao KHÔNG dùng một trang thật (trước đây là `/lien-he`): ở `next dev`, mọi
 * trang đều kéo theo `[locale]/layout.tsx` — tức là biên dịch Tailwind v4 **và**
 * tải font qua `next/font/google` (gọi mạng ra fonts.gstatic.com ngay lúc biên
 * dịch). Trên runner CI nguội, 2 nhân, lại đang chạy song song backend + vite,
 * lần biên dịch đầu tiên đó có thể vượt quá hạn chờ webServer.
 *
 * Route Handler đặt dưới `app/api/` nên:
 *   • KHÔNG đi qua `[locale]/layout.tsx` → không font, không Tailwind;
 *   • được `src/proxy.ts` bỏ qua (matcher loại trừ `api/`) → không bị rewrite
 *     locale, không 308;
 *   • KHÔNG gọi backend → sẵn sàng độc lập với API và dữ liệu đã seed.
 *
 * `force-dynamic` để không bị prerender thành file tĩnh lúc `next build` —
 * health check phải phản ánh tiến trình đang sống, không phải ảnh chụp lúc build.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok" });
}
