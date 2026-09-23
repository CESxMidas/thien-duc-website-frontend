import { getVietnamCurrentYear } from "./format";

describe("getVietnamCurrentYear", () => {
  it("tính năm theo giờ Việt Nam để tránh lệch hydration giữa server và client", () => {
    expect(getVietnamCurrentYear(new Date("2026-12-31T17:30:00.000Z"))).toBe(
      2027,
    );
    expect(getVietnamCurrentYear(new Date("2026-12-31T16:30:00.000Z"))).toBe(
      2026,
    );
  });
});
