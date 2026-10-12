import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NaturalRatioImageFrame } from "./natural-ratio-image-frame";

describe("NaturalRatioImageFrame", () => {
  it("doi ti le khung theo kich thuoc that cua anh", async () => {
    const { container } = render(
      <NaturalRatioImageFrame
        src="/images/projects/fancy-tower.jpg"
        alt="Fancy Tower"
        sizes="640px"
      />,
    );
    const image = screen.getByRole("img", { name: "Fancy Tower" });

    Object.defineProperty(image, "naturalWidth", {
      configurable: true,
      value: 1080,
    });
    Object.defineProperty(image, "naturalHeight", {
      configurable: true,
      value: 810,
    });
    fireEvent.load(image);

    await waitFor(() =>
      expect(container.firstElementChild).toHaveStyle({
        aspectRatio: "1.3333333333333333",
      }),
    );
  });
});
