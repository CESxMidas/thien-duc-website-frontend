import { readFileSync } from "node:fs";
import { join } from "node:path";

import { zaloContact } from "@/config/site";

const root = join(__dirname, "..", "..", "..");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");

describe("kênh Zalo thử nghiệm không xuất hiện trong shell public", () => {
  const publicShellFiles = [
    "src/components/layout/site-shell.tsx",
    "src/components/layout/site-footer.tsx",
    "src/app/[locale]/lien-he/page.tsx",
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/du-an/[slug]/page.tsx",
    "src/app/[locale]/tin-tuc/[slug]/page.tsx",
  ];

  it.each(publicShellFiles)("%s không gắn ZaloContactLink", (relative) => {
    expect(read(relative)).not.toContain("ZaloContactLink");
  });

  it.each(publicShellFiles)("%s không nhắc số Zalo thử nghiệm", (relative) => {
    expect(read(relative)).not.toContain(zaloContact.value);
  });

  it("SiteShell không còn prop/nút Zalo nổi", () => {
    const source = read("src/components/layout/site-shell.tsx");

    expect(source).not.toContain("showFloatingContact");
    expect(source).not.toContain('variant="floating"');
    expect(source).not.toContain("floating-zalo");
  });

  it("footer và trang liên hệ giữ các kênh chính thức phone/email/maps", () => {
    expect(read("src/components/layout/site-footer.tsx")).toContain("phoneHref");
    expect(read("src/components/layout/site-footer.tsx")).toContain("emailHref");
    expect(read("src/components/layout/site-footer.tsx")).toContain(
      "mapsHref",
    );
    expect(read("src/app/[locale]/lien-he/page.tsx")).toContain("phoneHref");
    expect(read("src/app/[locale]/lien-he/page.tsx")).toContain("mapsHref");
  });

  it("chỉ config/site.ts giữ giá trị Zalo để sau này thay bằng kênh chính thức", () => {
    expect(read("src/config/site.ts")).toContain(zaloContact.value);
  });
});

describe("không thêm phụ thuộc runtime cho Zalo", () => {
  const packageJson = JSON.parse(read("package.json")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  it("giữ nguyên bộ dependencies runtime", () => {
    expect(Object.keys(packageJson.dependencies).sort()).toEqual([
      "@sentry/nextjs",
      "lucide-react",
      "next",
      "react",
      "react-dom",
    ]);
  });

  it("không cài thư viện riêng cho Zalo", () => {
    const all = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const name of Object.keys(all)) {
      expect(name).not.toMatch(/zalo/i);
    }
  });
});
