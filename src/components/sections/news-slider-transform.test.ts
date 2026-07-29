import { trackTransform } from "@/components/sections/news-slider";

/**
 * Khoá lại lỗi thật đã gặp: track không nhúc nhích dù nút bấm chạy và chấm đổi.
 *
 * Nguyên nhân là `transform: translateX(-calc(...))` — dấu trừ đặt ngay TRƯỚC
 * `calc()` là cú pháp CSS không hợp lệ nên trình duyệt bỏ nguyên khai báo.
 *
 * Vì sao phải test bằng chuỗi chứ không phải bằng vị trí render: **jsdom không
 * kiểm cú pháp CSS**. Đã đo — gán `translateX(-calc((100% - 40px)/3 + 20px))`
 * vào `el.style.transform` thì jsdom lưu y nguyên, và `CSS.supports` không tồn
 * tại trong môi trường này. Nên mọi test dựa vào "phần tử có dịch không" đều
 * KHÔNG bắt được lỗi này; chỉ soi trực tiếp chuỗi mới bắt được.
 */
describe("trackTransform", () => {
  it("chỉ số 0 → không dịch", () => {
    expect(trackTransform(0, 3)).toBe("translateX(0px)");
  });

  it("chỉ số âm cũng về 0 (phòng thủ)", () => {
    expect(trackTransform(-2, 3)).toBe("translateX(0px)");
  });

  it("KHÔNG BAO GIỜ sinh `-calc(` — dấu trừ trước calc là CSS hỏng", () => {
    for (let visible = 1; visible <= 3; visible += 1) {
      for (let index = 0; index <= 8; index += 1) {
        expect(trackTransform(index, visible)).not.toContain("-calc(");
      }
    }
  });

  it("không lồng calc trong calc", () => {
    for (let index = 1; index <= 5; index += 1) {
      const value = trackTransform(index, 3);
      expect(value.match(/calc\(/g)).toHaveLength(1);
    }
  });

  it("desktop (3 ô, gap 20): công thức đúng cho từng bước", () => {
    expect(trackTransform(1, 3)).toBe(
      "translateX(calc(-1 * (100% - 40px) / 3 - 20px))",
    );
    expect(trackTransform(5, 3)).toBe(
      "translateX(calc(-5 * (100% - 40px) / 3 - 100px))",
    );
  });

  it("tablet (2 ô): tổng gap của track là 20px", () => {
    expect(trackTransform(1, 2)).toBe(
      "translateX(calc(-1 * (100% - 20px) / 2 - 20px))",
    );
  });

  it("mobile (1 ô): không có gap trong bề rộng thẻ", () => {
    expect(trackTransform(1, 1)).toBe(
      "translateX(calc(-1 * (100% - 0px) / 1 - 20px))",
    );
    expect(trackTransform(3, 1)).toBe(
      "translateX(calc(-3 * (100% - 0px) / 1 - 60px))",
    );
  });

  it("hệ số dịch tăng dần theo chỉ số (không đứng im, không đi lùi)", () => {
    const coefficients = [1, 2, 3, 4, 5].map((index) => {
      const match = /calc\((-\d+) \*/.exec(trackTransform(index, 3));
      return Number(match?.[1]);
    });

    expect(coefficients).toEqual([-1, -2, -3, -4, -5]);
  });

  it("phần bù gap cộng dồn đúng theo số bước", () => {
    const gaps = [1, 2, 3].map((index) => {
      const match = /- (\d+)px\)\)$/.exec(trackTransform(index, 3));
      return Number(match?.[1]);
    });

    expect(gaps).toEqual([20, 40, 60]);
  });
});
