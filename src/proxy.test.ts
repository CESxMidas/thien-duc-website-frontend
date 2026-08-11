/**
 * @jest-environment node
 *
 * Chạy ở môi trường `node` chứ không phải `jsdom`: `next/server` cần các global
 * Web API (`Request`, `Response`) mà jsdom không cung cấp. Middleware vốn cũng
 * chạy trên runtime edge/node, nên đây mới là môi trường đúng.
 */

/**
 * Chuyển hướng URL tìm kiếm cũ phải xảy ra ở **middleware**, không phải trong page.
 *
 * Lý do (đã đo trên server thật, không phải suy đoán): `tin-tuc/loading.tsx`
 * đặt cả cây `/tin-tuc/**` vào chế độ streaming. Response bị cam kết trước khi
 * code trang chạy, nên `permanentRedirect()` trong page KHÔNG đổi được HTTP
 * status — Next nhúng lệnh chuyển hướng vào payload và trả **200**:
 *
 *     /tin-tuc?q=Hung Phu  ->  HTTP 200  (payload chứa "tim-kiem?q=...;308;")
 *     /du-an?q=Hung Phu    ->  HTTP 308  (nhánh này không có loading.tsx)
 *
 * Trình duyệt vẫn đi tiếp, nhưng bot không nhận được 308 và URL cũ mất link
 * equity. Middleware chạy trước mọi render nên luôn phát được 308 thật.
 */
import { proxy } from "./proxy";
import { NextRequest } from "next/server";

function run(url: string) {
  const response = proxy(new NextRequest(new URL(url, "http://localhost:3000")));
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
    // Không phải `/vi/tim-kiem` — nếu vậy sẽ tốn thêm một lượt 308 nữa.
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
      // Rewrite nội bộ sang `/vi/...` là hành vi cũ, không phải redirect.
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
