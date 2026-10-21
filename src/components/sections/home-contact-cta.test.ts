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
  it("keeps the contact number on one unbroken line", () => {
    expect(formatPhoneLines("0909 768 001")).toEqual(["0909 768 001"]);
  });
});
