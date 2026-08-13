/**
 * Rào chắn ở mức mã nguồn cho kênh Zalo — những điều kiện không kiểm được bằng
 * render một component: số điện thoại chỉ tồn tại ở `config/site.ts`, trang
 * liên hệ có gắn kênh Zalo, trang chi tiết dự án KHÔNG nhân bản nút, và không
 * có dependency mới nào được thêm cho cái icon.
 *
 * Trang liên hệ là Server Component `async` có gọi API nên không render được
 * trong jsdom; kiểm tích hợp ở đây bằng cách đọc mã nguồn là đánh đổi có ý
 * thức — nó bắt đúng lỗi "quên gắn vào trang", còn phần hành vi của link đã có
 * `zalo-contact-link.test.tsx` phủ.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { zaloContact } from "@/config/site";

const root = join(__dirname, "..", "..", "..");
const read = (relative: string) =>
  readFileSync(join(root, relative), "utf8");

describe("số Zalo không bị chép cứng ra ngoài config", () => {
  // Mọi file sản phẩm dưới `src/`, trừ chính config và các file test (test
  // được phép nhắc số để chốt giá trị mong đợi).
  const productionFiles = [
    "src/components/ui/zalo-contact-link.tsx",
    "src/components/ui/zalo-icon.tsx",
    "src/components/layout/site-shell.tsx",
    "src/components/layout/site-footer.tsx",
    "src/app/[locale]/lien-he/page.tsx",
  ];

  it.each(productionFiles)("%s không chứa số thô", (relative) => {
    expect(read(relative)).not.toContain(zaloContact.value);
  });

  // Chỉ chặn việc TỰ DỰNG URL; nhắc tên miền trong chú thích thì không sao.
  it.each(productionFiles)("%s không tự dựng URL zalo.me", (relative) => {
    expect(read(relative)).not.toContain("https://zalo.me");
  });

  it("chỉ `config/site.ts` giữ giá trị số", () => {
    expect(read("src/config/site.ts")).toContain(zaloContact.value);
  });
});

describe("điểm gắn kết", () => {
  it("trang liên hệ có kênh Zalo bên cạnh điện thoại và biểu mẫu", () => {
    const source = read("src/app/[locale]/lien-he/page.tsx");

    expect(source).toContain("ZaloContactLink");
    expect(source).toContain("zaloHref");
    expect(source).toContain("zaloDisplayValue");
    // Không thay thế những gì đã có.
    expect(source).toContain("ContactForm");
    expect(source).toContain("phoneHref");
  });

  it("nút nổi được gắn đúng một lần, ở SiteShell", () => {
    const source = read("src/components/layout/site-shell.tsx");
    const matches = source.match(/variant="floating"/g) ?? [];

    expect(matches).toHaveLength(1);
  });

  it("SiteShell mặc định BẬT nút nổi và cho phép tắt hẳn (không render)", () => {
    const source = read("src/components/layout/site-shell.tsx");

    expect(source).toContain("showFloatingContact = true");
    // Không render chứ không phải ẩn bằng CSS.
    expect(source).toMatch(/showFloatingContact \? \(/);
  });

  it("trang liên hệ TẮT nút nổi nhưng GIỮ kênh Zalo nội dòng", () => {
    const source = read("src/app/[locale]/lien-he/page.tsx");

    expect(source).toContain("showFloatingContact={false}");
    expect(source).toContain('variant="inline"');
    expect(source).not.toContain('variant="floating"');
  });

  it.each([
    ["src/app/[locale]/page.tsx", "trang chủ"],
    ["src/app/[locale]/du-an/[slug]/page.tsx", "chi tiết dự án"],
    ["src/app/[locale]/tin-tuc/[slug]/page.tsx", "chi tiết tin"],
  ])("%s (%s) giữ nút nổi mặc định", (relative) => {
    const source = read(relative);

    expect(source).toContain("<SiteShell");
    expect(source).not.toContain("showFloatingContact");
  });

  it("trang chi tiết dự án KHÔNG nhân bản nút Zalo cạnh 'Liên hệ tư vấn'", () => {
    const source = read("src/app/[locale]/du-an/[slug]/page.tsx");

    expect(source).not.toContain("Zalo");
    expect(source).not.toContain("zalo");
  });
});

describe("không thêm phụ thuộc", () => {
  const packageJson = JSON.parse(read("package.json")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  it("giữ nguyên bộ dependencies runtime — icon là SVG nội tuyến", () => {
    expect(Object.keys(packageJson.dependencies).sort()).toEqual([
      "@sentry/nextjs",
      "lucide-react",
      "next",
      "react",
      "react-dom",
    ]);
  });

  it("không cài thư viện icon nào cho Zalo", () => {
    const all = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const name of Object.keys(all)) {
      expect(name).not.toMatch(/zalo/i);
    }
  });
});
