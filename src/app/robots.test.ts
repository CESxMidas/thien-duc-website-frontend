/**
 * Hồi quy cho sự cố deploy: `/robots.txt` prerender lúc `next build` và ném
 * `TypeError: Invalid URL — input: '/sitemap.xml', base: ''` vì base URL của
 * site rỗng. Test này khoá đúng điều đã hỏng: `sitemap`/`host` phải là **URL
 * tuyệt đối**, và việc dựng chúng không được ném.
 */
import { siteConfig } from "@/config/site";
import robots from "./robots";

describe("robots.txt", () => {
  const result = robots();

  it("không ném và trỏ sitemap tới URL tuyệt đối", () => {
    expect(() => robots()).not.toThrow();
    expect(result.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(String(result.sitemap)).toMatch(/^https?:\/\/[^/]+\/sitemap\.xml$/);
  });

  it("host là origin tuyệt đối, không phải chuỗi rỗng hay đường dẫn tương đối", () => {
    expect(result.host).toBe(`${siteConfig.url}/`);
    expect(String(result.host)).toMatch(/^https?:\/\//);
  });

  it("chặn các route khung chờ ở CẢ hai locale", () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rules?.disallow as string[];
    expect(disallow).toContain("/tuyen-dung");
    expect(disallow).toContain("/en/tuyen-dung");
  });

  /**
   * Batch 15B — Admin CMS phục vụ dưới `/admin` của chính domain này.
   *
   * Chỉ dẫn SEO, KHÔNG phải bảo mật (robots.txt là file công khai). Hai lớp có
   * tác dụng thật là `X-Robots-Tag` ở `next.config.ts` và thẻ `<meta robots>`
   * trong `index.html` của Admin; chốt quyền vẫn nằm ở backend.
   */
  it("chặn /admin (CMS không được vào chỉ mục)", () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rules?.disallow as string[];
    expect(disallow).toContain("/admin");
  });

  it("KHÔNG gắn tiền tố locale cho /admin (không phải trang Next)", () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rules?.disallow as string[];
    expect(disallow).not.toContain("/en/admin");
    expect(disallow).not.toContain("/vi/admin");
  });
});
