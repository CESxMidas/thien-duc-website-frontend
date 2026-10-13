/** @jest-environment node */

import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

async function run(url: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  const response = await proxy(
    new NextRequest(new URL(url, "http://localhost:3000"), init),
  );

  return {
    status: response.status,
    location: response.headers.get("location"),
    body: await response.text(),
  };
}

describe("proxy - legacy search redirects", () => {
  it("/tin-tuc?q= redirects to /tim-kiem and keeps the query", async () => {
    const { status, location } = await run("/tin-tuc?q=Hung Phu");

    expect(status).toBe(308);
    expect(new URL(location!).pathname).toBe("/tim-kiem");
    expect(new URL(location!).searchParams.get("q")).toBe("Hung Phu");
  });

  it("/du-an?q= redirects to /tim-kiem and keeps the query", async () => {
    const { status, location } = await run("/du-an?q=Hung Phu");

    expect(status).toBe(308);
    expect(new URL(location!).pathname).toBe("/tim-kiem");
    expect(new URL(location!).searchParams.get("q")).toBe("Hung Phu");
  });

  it("keeps the EN locale prefix", async () => {
    for (const path of ["/en/tin-tuc?q=hung", "/en/du-an?q=hung"]) {
      const { status, location } = await run(path);

      expect(status).toBe(308);
      expect(new URL(location!).pathname).toBe("/en/tim-kiem");
    }
  });

  it("/vi/ canonicalizes directly without a second redirect", async () => {
    const { status, location } = await run("/vi/tin-tuc?q=hung");

    expect(status).toBe(308);
    expect(new URL(location!).pathname).toBe("/tim-kiem");
  });

  it("encodes special query characters safely", async () => {
    const { location } = await run("/tin-tuc?q=a%26b%3Dc");

    expect(new URL(location!).searchParams.get("q")).toBe("a&b=c");
  });

  it("empty q does not redirect to search", async () => {
    for (const path of ["/tin-tuc?q=", "/tin-tuc?q=%20%20"]) {
      const { location } = await run(path);
      expect(new URL(location ?? "http://x/").pathname).not.toBe("/tim-kiem");
    }
  });

  it("list, pagination, filters, and categories keep old internal rewrite behavior", async () => {
    for (const path of [
      "/tin-tuc",
      "/tin-tuc?page=2",
      "/du-an?status=dang-thi-cong",
      "/tin-tuc/danh-muc/tin-du-an",
    ]) {
      const { status, location } = await run(path);

      expect(status).not.toBe(308);
      expect(location).toBeNull();
    }
  });

  it("news child pages are not mistaken for legacy search URLs", async () => {
    const { status } = await run("/tin-tuc/bai-viet-nao-do?q=abc");

    expect(status).not.toBe(308);
  });
});

describe("proxy - news detail 404 precheck", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns a hard 404 when the news API says the slug is missing", async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response("{}", { status: 404 }));

    const { status, body } = await run("/tin-tuc/missing-slug");

    expect(status).toBe(404);
    expect(body).toContain("<title>404:");
    expect(body).not.toContain("og:type");
  });

  it("also returns 404 for localized EN news detail routes", async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response("{}", { status: 404 }));

    const { status, body } = await run("/en/tin-tuc/missing-slug");

    expect(status).toBe(404);
    expect(body).toContain('lang="en"');
  });

  it("lets valid news slugs continue to the app router", async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response("{}", { status: 200 }));

    const { status, location } = await run("/tin-tuc/valid-slug");

    expect(status).not.toBe(404);
    expect(location).toBeNull();
  });

  it("does not block the route when the API precheck is unavailable", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline"));

    const { status, location } = await run("/tin-tuc/valid-while-offline");

    expect(status).not.toBe(404);
    expect(location).toBeNull();
  });
});

describe("proxy - locale routing legacy behavior", () => {
  it("/vi/... redirects to the canonical non-prefixed URL", async () => {
    const { status, location } = await run("/vi/du-an");

    expect(status).toBe(308);
    expect(new URL(location!).pathname).toBe("/du-an");
  });

  it("/en/... passes through without redirect", async () => {
    expect((await run("/en/du-an")).location).toBeNull();
  });
});

describe("proxy - matcher excludes /admin", () => {
  const matcher = new RegExp(`^${config.matcher[0]}$`);

  function runsMiddleware(pathname: string): boolean {
    return matcher.test(pathname);
  }

  it.each([
    "/admin",
    "/admin/",
    "/admin/dang-nhap",
    "/admin/du-an",
    "/admin/tin-tuc/chuyen-muc",
  ])("%s does not go through locale routing", (pathname) => {
    expect(runsMiddleware(pathname)).toBe(false);
  });

  it("bare /admin also exits via the admin$ clause", () => {
    expect(runsMiddleware("/admin")).toBe(false);
  });

  it("public routes still go through locale routing", () => {
    for (const pathname of [
      "/",
      "/du-an",
      "/tin-tuc",
      "/en/du-an",
      "/vi/du-an",
    ]) {
      expect(runsMiddleware(pathname)).toBe(true);
    }
  });

  it("does not exclude public slugs that only share the admin prefix", () => {
    expect(runsMiddleware("/administrator-example")).toBe(true);
    expect(runsMiddleware("/admin-noi-bo")).toBe(true);
  });

  it("keeps old exclusions", () => {
    expect(runsMiddleware("/_next/static/chunk.js")).toBe(false);
    expect(runsMiddleware("/api/health")).toBe(false);
    expect(runsMiddleware("/images/logo.png")).toBe(false);
    expect(runsMiddleware("/sitemap.xml")).toBe(false);
    expect(runsMiddleware("/robots.txt")).toBe(false);
    expect(runsMiddleware("/favicon.ico")).toBe(false);
  });
});
