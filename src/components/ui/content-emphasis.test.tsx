import { render } from "@testing-library/react";
import { ContentEmphasis } from "./content-emphasis";

describe("ContentEmphasis", () => {
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
