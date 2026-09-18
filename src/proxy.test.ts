/** @jest-environment node */

import { proxy, config } from "./proxy";
import { NextRequest } from "next/server";

function run(url: string) {
  const response = proxy(
    new NextRequest(new URL(url, "http://localhost:3000")),
  );

  return {
    status: response.status,
    location: response.headers.get("location"),
  };
}

describe("proxy — chuyển hướng tìm kiếm cũ", () => {
  it("/tin-tuc?q= → 308 sang /tim-kiem, giữ từ khóa", () => {
    const { status, location } = run("/tin-tuc?q=Hung Phu");

    expect(status).toBe(308);

    expect(new URL(location!).pathname).toBe("/tim-kiem");

    expect(new URL(location!).searchParams.get("q")).toBe("Hung Phu");
  });

  it("/du-an?q= → 308 sang /tim-kiem, giữ từ khóa", () => {
    const { status, location } = run("/du-an?q=Hung Phu");

    expect(status).toBe(308);

    expect(new URL(location!).pathname).toBe("/tim-kiem");

    expect(new URL(location!).searchParams.get("q")).toBe("Hung Phu");
  });

  it("giữ locale EN", () => {
    for (const path of ["/en/tin-tuc?q=hung", "/en/du-an?q=hung"]) {
      const { status, location } = run(path);

      expect(status).toBe(308);

      expect(new URL(location!).pathname).toBe("/en/tim-kiem");
    }
  });

  it("`/vi/` gộp thẳng về URL chính tắc, KHÔNG chuyển hướng hai lần", () => {
    const { status, location } = run("/vi/tin-tuc?q=hung");

    expect(status).toBe(308);

    expect(new URL(location!).pathname).toBe("/tim-kiem");
  });

  it("từ khóa có ký tự đặc biệt được mã hoá an toàn", () => {
    const { location } = run("/tin-tuc?q=a%26b%3Dc");

    expect(new URL(location!).searchParams.get("q")).toBe("a&b=c");
  });

  it("`?q=` rỗng/khoảng trắng KHÔNG chuyển sang trang tìm kiếm", () => {
    for (const path of ["/tin-tuc?q=", "/tin-tuc?q=%20%20"]) {
      expect(new URL(run(path).location ?? "http://x/").pathname).not.toBe(
        "/tim-kiem",
      );
    }
  });

  it("danh sách thường, phân trang, lọc trạng thái KHÔNG bị đụng", () => {
    for (const path of [
      "/tin-tuc",
      "/tin-tuc?page=2",
      "/du-an?status=dang-thi-cong",
      "/tin-tuc/danh-muc/tin-du-an",
    ]) {
      const { status, location } = run(path);

      // Rewrite nội bộ sang `/vi/...` là hành vi cũ,
      // không phải redirect.
      expect(status).not.toBe(308);
      expect(location).toBeNull();
    }
  });

  it("trang con của tin tức KHÔNG bị nhận nhầm là URL tìm kiếm cũ", () => {
    const { status } = run("/tin-tuc/bai-viet-nao-do?q=abc");

    expect(status).not.toBe(308);
  });
});

describe("proxy — định tuyến locale (hành vi cũ, không được phá)", () => {
  it("`/vi/...` → 308 về bản không tiền tố", () => {
    const { status, location } = run("/vi/du-an");

    expect(status).toBe(308);

    expect(new URL(location!).pathname).toBe("/du-an");
  });

  it("`/en/...` đi thẳng, không chuyển hướng", () => {
    expect(run("/en/du-an").location).toBeNull();
  });
});

describe("proxy — matcher loại trừ /admin (Batch 15B)", () => {
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
  ])("%s KHÔNG đi qua định tuyến locale", (pathname) => {
    expect(runsMiddleware(pathname)).toBe(false);
  });

  it("/admin trần cũng phải thoát (mệnh đề `admin$`)", () => {
    expect(runsMiddleware("/admin")).toBe(false);
  });

  it("route công khai VẪN đi qua định tuyến locale", () => {
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

  it("KHÔNG loại trừ nhầm slug công khai chỉ trùng tiền tố", () => {
    expect(runsMiddleware("/administrator-example")).toBe(true);

    expect(runsMiddleware("/admin-noi-bo")).toBe(true);
  });

  it("giữ nguyên các loại trừ cũ", () => {
    expect(runsMiddleware("/_next/static/chunk.js")).toBe(false);

    expect(runsMiddleware("/api/health")).toBe(false);

    expect(runsMiddleware("/images/logo.png")).toBe(false);

    expect(runsMiddleware("/sitemap.xml")).toBe(false);

    expect(runsMiddleware("/robots.txt")).toBe(false);

    expect(runsMiddleware("/favicon.ico")).toBe(false);
  });
});
