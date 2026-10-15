import { formatDate, getVietnamCurrentYear } from "./format";

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

describe("formatDate", () => {
  it("formats calendar dates in Vietnam time on both server and client", () => {
    const formatter = jest.spyOn(Intl, "DateTimeFormat");

    expect(formatDate("2026-09-02", "vi")).toBe("02/09/2026");
    expect(formatDate("2026-09-02", "en")).toBe("September 2, 2026");
    expect(formatter).toHaveBeenCalledWith(
      "vi-VN",
      expect.objectContaining({ timeZone: "Asia/Ho_Chi_Minh" }),
    );
    expect(formatter).toHaveBeenCalledWith(
      "en-US",
      expect.objectContaining({ timeZone: "Asia/Ho_Chi_Minh" }),
    );

    formatter.mockRestore();
  });
});
