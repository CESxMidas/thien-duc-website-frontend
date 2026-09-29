import { readFileSync } from "node:fs";
import { join } from "node:path";

import { zaloContact } from "@/config/site";

const root = join(__dirname, "..", "..", "..");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");

describe("public Zalo channel", () => {
  const filesWithoutDirectZaloButton = [
    "src/components/layout/site-footer.tsx",
    "src/app/[locale]/lien-he/page.tsx",
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/du-an/[slug]/page.tsx",
    "src/app/[locale]/tin-tuc/[slug]/page.tsx",
  ];

  it("renders the floating Zalo button from SiteShell", () => {
    const source = read("src/components/layout/site-shell.tsx");

    expect(source).toContain("ZaloContactLink");
    expect(source).toContain('variant="floating"');
    expect(source).toContain("zaloHref()");
    expect(source).toContain("zaloDisplayValue()");
  });

  it.each(filesWithoutDirectZaloButton)(
    "%s does not duplicate ZaloContactLink",
    (relative) => {
      expect(read(relative)).not.toContain("ZaloContactLink");
    },
  );

  it.each([
    ...filesWithoutDirectZaloButton,
    "src/components/layout/site-shell.tsx",
  ])("%s does not hard-code the Zalo number", (relative) => {
    expect(read(relative)).not.toContain(zaloContact.value);
  });

  it("keeps footer and contact page on the official phone/email/maps channels", () => {
    expect(read("src/components/layout/site-footer.tsx")).toContain("phoneHref");
    expect(read("src/components/layout/site-footer.tsx")).toContain("emailHref");
    expect(read("src/components/layout/site-footer.tsx")).toContain("mapsHref");
    expect(read("src/app/[locale]/lien-he/page.tsx")).toContain("phoneHref");
    expect(read("src/app/[locale]/lien-he/page.tsx")).toContain("mapsHref");
  });

  it("keeps the Zalo value in config only", () => {
    expect(read("src/config/site.ts")).toContain(zaloContact.value);
  });
});

describe("no Zalo runtime dependency", () => {
  const packageJson = JSON.parse(read("package.json")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  it("keeps the runtime dependency list unchanged", () => {
    expect(Object.keys(packageJson.dependencies).sort()).toEqual([
      "@sentry/nextjs",
      "lucide-react",
      "next",
      "react",
      "react-dom",
    ]);
  });

  it("does not install a Zalo-specific package", () => {
    const all = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const name of Object.keys(all)) {
      expect(name).not.toMatch(/zalo/i);
    }
  });
});
