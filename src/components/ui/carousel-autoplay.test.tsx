import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useCarouselPlayback } from "@/lib/use-carousel-playback";
import { CarouselAutoplay } from "./carousel-autoplay";

function Harness() {
  const [index, setIndex] = useState(0);
  const playback = useCarouselPlayback();
  return (
    <section {...playback.handlers} data-testid="carousel">
      <output>{index}</output>
      <button>Details</button>
      <CarouselAutoplay
        index={index}
        enabled
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={() => setIndex((value) => value + 1)}
        testId="progress"
      />
    </section>
  );
}
let motionChanged: () => void;
let reduced = false;
beforeEach(() => {
  reduced = false;
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, listener: () => void) => {
      motionChanged = listener;
    },
    removeEventListener: jest.fn(),
  }));
});
it("starts another full autoplay cycle after each slide", () => {
  render(<Harness />);
  const first = screen.getByTestId("progress");
  expect(first).toHaveStyle({ animationDuration: "5200ms" });
  fireEvent.animationEnd(first);
  expect(screen.getByRole("status")).toHaveTextContent("1");
  expect(screen.getByTestId("progress")).not.toBe(first);
  fireEvent.animationEnd(screen.getByTestId("progress"));
  expect(screen.getByRole("status")).toHaveTextContent("2");
});
it("keeps focus pause when the pointer leaves and resumes after focus leaves", () => {
  render(<Harness />);
  const region = screen.getByTestId("carousel");
  const button = screen.getByRole("button");
  fireEvent.mouseEnter(region);
  fireEvent.focus(button);
  fireEvent.mouseLeave(region);
  fireEvent.animationEnd(screen.getByTestId("progress"));
  expect(screen.getByRole("status")).toHaveTextContent("0");
  fireEvent.blur(button, { relatedTarget: null });
  expect(screen.getByTestId("progress")).toHaveStyle({
    animationPlayState: "running",
  });
  fireEvent.animationEnd(screen.getByTestId("progress"));
  expect(screen.getByRole("status")).toHaveTextContent("1");
});
it("reacts to reduced-motion changes while mounted", () => {
  render(<Harness />);
  act(() => {
    reduced = true;
    motionChanged();
  });
  expect(screen.queryByTestId("progress")).toBeNull();
  act(() => {
    reduced = false;
    motionChanged();
  });
  expect(screen.getByTestId("progress")).toBeInTheDocument();
});
it("pauses while the browser tab is hidden", () => {
  render(<Harness />);
  const original = Object.getOwnPropertyDescriptor(document, "hidden");
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: true,
  });
  fireEvent(document, new Event("visibilitychange"));
  expect(screen.getByTestId("progress")).toHaveStyle({
    animationPlayState: "paused",
  });
  if (original) Object.defineProperty(document, "hidden", original);
  else Reflect.deleteProperty(document, "hidden");
});
