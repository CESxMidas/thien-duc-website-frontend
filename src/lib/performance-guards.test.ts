/**
 * THIEN-DUC-OPTIONAL-BACKLOG-CODING-COMPLETION-M2 — hàng rào chống HỒI QUY hiệu
 * năng (backlog §6 "G4 — tối ưu hiệu năng còn lại", mục 4C).
 *
 * Đây KHÔNG phải test đo hiệu năng — không đo thời gian, không dựng trình
 * duyệt, không phụ thuộc máy chạy nhanh hay chậm. Chúng đọc MÃ NGUỒN và khoá
 * lại vài quyết định đã trả giá để tìm ra, để lần sau không ai vô tình đạp lại:
 *
 *   1. `quality={100}` ở ảnh bản đồ từng làm `/_next/image` trả HTTP 400 (D8) —
 *      ảnh hỏng trên MỌI trang chi tiết dự án, không chỉ "lệch cấu hình".
 *   2. Chỉ slide banner ĐẦU TIÊN được preload; preload tất cả thì mấy ảnh nền
 *      full-bleed cùng tranh băng thông với LCP.
 *   3. Các slide sau phải `lazy` — bỏ `lazy` là kéo toàn bộ ảnh banner ngay từ
 *      lần tải đầu.
 *
 * Cố ý KHÔNG bám vào tên chunk hay hash sinh ra lúc build (giòn, đổi mỗi lần
 * build). Chúng bám vào chính dòng mã mà lập trình viên sẽ sửa.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

function readSource(relative: string): string {
  return readFileSync(path.join(SRC, relative), "utf8");
}

/**
 * Gỡ chú thích để khẳng định chạy trên MÃ THẬT, không dính chữ trong comment.
 *
 * Khối chú thích BẮT BUỘC phải mở ở đầu dòng. Bản đầu tiên của helper này bắt
 * mọi `/*` ở bất kỳ đâu và đã nuốt nhầm cả khối `images` — vì chuỗi
 * `pathname: "/ksnntvmu/**"` (allowlist Cloudinary) có chứa `/*`, khiến regex
 * tưởng là mở chú thích rồi xoá tới `*​/` kế tiếp. Mọi khối chú thích thật
 * trong các file này đều bắt đầu ở đầu dòng, nên ràng buộc đó là đủ và an toàn.
 */
function stripComments(source: string): string {
  return source.replace(/^[ \t]*\/\*[\s\S]*?\*\//gm, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("Ảnh bản đồ dự án — không hồi quy về quality={100} (D8)", () => {
  const code = stripComments(readSource("components/sections/project-location-map.tsx"));

  it("KHÔNG dùng quality={100} (Next trả HTTP 400 vì ngoài images.qualities)", () => {
    expect(code).not.toMatch(/quality=\{100\}/);
  });

  it("dùng đúng quality={90} — mức cao nhất được allowlist", () => {
    expect(code).toMatch(/quality=\{90\}/);
  });

  it("mọi quality trong file đều nằm trong allowlist [75, 90]", () => {
    const qualities = [...code.matchAll(/quality=\{(\d+)\}/g)].map((m) => Number(m[1]));
    expect(qualities.length).toBeGreaterThan(0);
    for (const q of qualities) expect([75, 90]).toContain(q);
  });
});

describe("Banner trang chủ — chỉ slide đầu được ưu tiên tải", () => {
  const code = stripComments(readSource("components/sections/home-banner-slider.tsx"));

  it("preload có ĐIỀU KIỆN theo index === 0, không phải preload vô điều kiện", () => {
    expect(code).toMatch(/preload=\{index === 0\}/);
    // `preload` hoặc `priority` trần (luôn bật) là hồi quy.
    expect(code).not.toMatch(/<Image[^>]*\spreload(\s|\/|>)/);
    expect(code).not.toMatch(/\bpriority(\s*=\s*\{true\}|\s*\/?>)/);
  });

  it("các slide SAU slide đầu vẫn lazy", () => {
    expect(code).toMatch(/loading=\{index === 0 \? undefined : "lazy"\}/);
  });

  it("đúng MỘT ảnh banner được khai báo (một <Image> lặp theo slide)", () => {
    // Nhiều <Image> nghĩa là ai đó đã tách nhánh render — lúc đó phải xem lại
    // hai khẳng định trên vì chúng chỉ soi được một nhánh.
    expect((code.match(/<Image\b/g) ?? []).length).toBe(1);
  });

  it("giữ sizes=100vw (ảnh full-bleed, thiếu sizes thì Next tải quá cỡ)", () => {
    expect(code).toMatch(/sizes="100vw"/);
  });
});

describe("Cấu hình ảnh — allowlist chất lượng không bị nới lỏng", () => {
  const config = stripComments(
    readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8"),
  );

  it("images.qualities vẫn giới hạn ở [75, 90]", () => {
    expect(config).toMatch(/qualities:\s*\[\s*75\s*,\s*90\s*\]/);
  });
});

describe("Bundle analyzer — không bao giờ chạy trong build thường", () => {
  const pkg = JSON.parse(
    readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
  ) as { scripts: Record<string, string> };

  it("có script `analyze` riêng", () => {
    expect(pkg.scripts.analyze).toBeDefined();
  });

  it("`npm run build` KHÔNG kèm cờ phân tích (Vercel/CI không được chạy analyzer)", () => {
    expect(pkg.scripts.build).not.toMatch(/analyze/i);
  });

  it("analyzer dùng cờ Turbopack-native, không phải plugin webpack", () => {
    const script = stripComments(
      readFileSync(path.join(process.cwd(), "scripts/analyze.mjs"), "utf8"),
    );
    expect(script).toMatch(/--experimental-analyze/);
    // `@next/bundle-analyzer` là plugin webpack — Turbopack bỏ qua, báo cáo rỗng.
    expect(script).not.toMatch(/@next\/bundle-analyzer/);
  });
});
