import { render } from "@testing-library/react";
import { ContentEmphasis } from "./content-emphasis";

describe("ContentEmphasis", () => {
  it("nhấn tên công ty, khách sạn và chứng nhận 3 sao, giữ nguyên biểu tượng trong bài", () => {
    const text = "Công ty TNHH Đầu tư Xây dựng - Thương mại Thiên Đức trân trọng và tự hào đồng hành cùng Cannes Hotel trong dấu mốc đặc biệt: Lễ công bố Cannes Hotel đạt tiêu chuẩn Khách sạn 3 sao ⭐⭐⭐.";
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual([
        "Công ty TNHH Đầu tư Xây dựng - Thương mại Thiên Đức",
        "Cannes Hotel",
        "Khách sạn 3 sao",
      ]);
  });

  it("nhận cách viết cột mốc 3 sao trong phần nội dung", () => {
    const text = "Với Thiên Đức, mỗi công trình là một giá trị được vun đắp. Cột mốc 3 sao của Cannes Hotel là niềm vui của tập thể khách sạn. 💫";
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual(["Thiên Đức", "Cột mốc 3 sao", "Cannes Hotel"]);
  });

  it("ưu tiên khẩu hiệu đầy đủ trong đoạn chúc mừng, không tô đậm lồng nhau", () => {
    const text = "Thiên Đức xin chúc mừng Cannes Hotel với dấu mốc mới trên hành trình phát triển. Chúc khách sạn trở thành một điểm đến được yêu mến tại Bến Tre. Thiên Đức – Đồng hành kiến tạo giá trị, bền vững cùng thời gian";
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual([
        "Thiên Đức",
        "Cannes Hotel",
        "Bến Tre",
        "Đồng hành kiến tạo giá trị, bền vững cùng thời gian",
      ]);
    expect(container.querySelector("strong strong")).toBeNull();
  });

  it("nhấn đúng bốn thực thể chính trong đoạn xác lập kỷ lục", () => {
    const text = "Một trong những dấu ấn nổi bật của chương trình là hoạt động xác lập Kỷ lục Việt Nam với mô hình logo CANNES HOTEL được tạo hình bằng món Gỏi củ hủ dừa tôm thịt tại Khu Đô thị Hưng Phú. 684 phần gỏi tạo nên một tác phẩm đặc biệt.";
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual([
        "Kỷ lục Việt Nam",
        "CANNES HOTEL",
        "Gỏi củ hủ dừa tôm thịt",
        "Khu Đô thị Hưng Phú",
      ]);
  });

  it.each([
    "“Tinh hoa Ẩm thực Xứ Dừa” 2026",
    '"Tinh hoa Ẩm thực Xứ Dừa" 2026',
    "Tinh hoa Ẩm thực Xứ Dừa",
  ])("nhận tên chương trình có hoặc không có ngoặc kép: %s", (name) => {
    const text = `Tại Bến Tre, ${name} lan tỏa giá trị văn hóa Xứ Dừa.`;
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual(["Bến Tre", name, "Xứ Dừa"]);
    expect(container.querySelector("strong strong")).toBeNull();
  });

  it("ưu tiên đầy đủ biến thể tên công ty có dấu gạch nối trong bài", () => {
    const name = "Công ty TNHH Đầu tư Xây dựng - Thương mại Thiên Đức";
    const { container } = render(<ContentEmphasis text={`${name} trân trọng đồng hành cùng Cannes Hotel.`} />);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual([name, "Cannes Hotel"]);
  });

  it("tô đậm độc lập tên công ty, chương trình và danh xưng nhà tài trợ trong cùng đoạn", () => {
    const text = "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức tự hào đồng hành cùng chương trình Tinh hoa Ẩm thực Xứ Dừa 2026 với vai trò Nhà tài trợ Kim Cương, góp phần chung tay tạo nên một sự kiện giàu ý nghĩa.";
    const { container } = render(<p><ContentEmphasis text={text} /></p>);

    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual([
        "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức",
        "Tinh hoa Ẩm thực Xứ Dừa 2026",
        "Nhà tài trợ Kim Cương",
      ]);
    expect(container.querySelector("strong strong")).toBeNull();
  });

  it.each([
    "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức phát triển khu đô thị Hưng Phú năm 2026.",
    "Thien Duc Investment Construction Trading Co., Ltd develops Hung Phu Urban Area in 2026.",
  ])("preserves localized copy and prefers complete names: %s", (text) => {
    const { container } = render(<p><ContentEmphasis text={text} /></p>);
    expect(container.textContent).toBe(text);
    const spans = container.querySelectorAll("strong");
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe(text.split(" phát triển")[0].split(" develops")[0]);
    expect(container.querySelector("strong strong")).toBeNull();
  });

  it("emphasizes only the first mention and does not match within words or identifiers", () => {
    const text = "Cannes Hotelier X2026 20260 Thiên Đứcan. Cannes Hotel và Cannes Hotel, 2026 và 2026.";
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual(["Cannes Hotel", "2026"]);
  });

  it("keeps CMS markup inert and preserves whitespace", () => {
    const text = '<script>alert("x")</script>\nCannes Hotel & Thiên Đức';
    const { container } = render(<ContentEmphasis text={text} />);
    expect(container.textContent).toBe(text);
    expect(container.querySelector("script")).toBeNull();
  });

  it("supports explicit page names without emphasizing arbitrary years", () => {
    const text = "CapitaLand giai đoạn 2014 và 2018, mã 2019.";
    const { container } = render(<ContentEmphasis text={text} names={["CapitaLand", "2014", "2018"]} />);
    expect(Array.from(container.querySelectorAll("strong"), (node) => node.textContent))
      .toEqual(["CapitaLand", "2014", "2018"]);
  });
});
