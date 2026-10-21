import { formatContactTitle, formatPhoneLines } from "./home-contact-cta";

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

describe("formatPhoneLines", () => {
  it("places each contact number on its own line", () => {
    expect(formatPhoneLines("(028) 3740 7188 / 0909 768 001")).toEqual([
      "(028) 3740 7188",
      "0909 768 001",
    ]);
  });
});
