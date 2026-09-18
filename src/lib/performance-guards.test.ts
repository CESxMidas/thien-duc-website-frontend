import { readFileSync } from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

function readSource(relative: string): string {
  return readFileSync(path.join(SRC, relative), "utf8");
}

function stripComments(source: string): string {
  return source
    .replace(/^[ \t]*\/\*[\s\S]*?\*\//gm, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("Ảnh bản đồ dự án — không hồi quy về quality={100} (D8)", () => {
  const code = stripComments(
    readSource("components/sections/project-location-map.tsx"),
  );

  it("KHÔNG dùng quality={100} (Next trả HTTP 400 vì ngoài images.qualities)", () => {
    expect(code).not.toMatch(/quality=\{100\}/);
  });

  it("dùng đúng quality={90} — mức cao nhất được allowlist", () => {
    expect(code).toMatch(/quality=\{90\}/);
  });

  it("mọi quality trong file đều nằm trong allowlist [75, 90]", () => {
    const qualities = [...code.matchAll(/quality=\{(\d+)\}/g)].map((match) =>
      Number(match[1]),
    );

    expect(qualities.length).toBeGreaterThan(0);

    for (const quality of qualities) {
      expect([75, 90]).toContain(quality);
    }
  });
});

describe("Banner trang chủ — chỉ slide đầu được ưu tiên tải", () => {
  const code = stripComments(
    readSource("components/sections/home-banner-slider.tsx"),
  );

  it("preload có ĐIỀU KIỆN theo index === 0, không phải preload vô điều kiện", () => {
    expect(code).toMatch(/preload=\{index === 0\}/);

    expect(code).not.toMatch(/<Image[^>]*\spreload(\s|\/|>)/);

    expect(code).not.toMatch(/\bpriority(\s*=\s*\{true\}|\s*\/?>)/);
  });

  it("các slide SAU slide đầu vẫn lazy", () => {
    expect(code).toMatch(/loading=\{index === 0 \? undefined : "lazy"\}/);
  });

  it("đúng MỘT ảnh banner được khai báo (một <Image> lặp theo slide)", () => {
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
  ) as {
    scripts: Record<string, string>;
  };

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

    // `@next/bundle-analyzer` là plugin webpack.
    // Turbopack bỏ qua và có thể cho báo cáo rỗng.
    expect(script).not.toMatch(/@next\/bundle-analyzer/);
  });
});

describe("Reduced motion — nội dung stagger không bị ẩn", () => {
  const css = readSource("app/globals.css");

  it("có media query prefers-reduced-motion: reduce", () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it("hiện trực tiếp phần tử con của stagger-list", () => {
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.stagger-list\.stagger-list\s*>\s*\*[\s\S]*?opacity:\s*1;[\s\S]*?transform:\s*none;/,
    );
  });
});

describe("Motion reveal — không can thiệp vào hydration", () => {
  const code = readSource("components/motion/motion-root.tsx");

  it("khởi tạo IntersectionObserver trong useEffect", () => {
    expect(code).toMatch(
      /useEffect\(\(\) => \{[\s\S]*?new IntersectionObserver/,
    );
  });
});
