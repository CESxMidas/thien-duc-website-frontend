import { formatContactTitle } from "./home-contact-cta";

describe("formatContactTitle", () => {
  it("preserves every comma-separated phrase", () => {
    expect(
      formatContactTitle(
        "Discuss projects, partnerships, or advisory needs",
      ),
    ).toEqual([
      "Discuss projects,",
      "partnerships,",
      "or advisory needs",
    ]);
  });

  it("keeps a title without commas intact", () => {
    expect(formatContactTitle("Contact Thien Duc")).toEqual([
      "Contact Thien Duc",
    ]);
  });
});
