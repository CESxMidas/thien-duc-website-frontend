import { act, renderHook } from "@testing-library/react";
import {
  OVERLAY_EXIT_MS,
  useAnimatedClose,
  useOverlayPresence,
} from "./use-overlay-motion";

const originalMatchMedia = window.matchMedia;
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  window.matchMedia = originalMatchMedia;
});

it("giữ lớp nổi khi đóng và không gỡ nhầm nếu mở lại nhanh", () => {
  const { result, rerender } = renderHook(
    ({ open }) => useOverlayPresence(open),
    { initialProps: { open: false } },
  );
  expect(result.current.mounted).toBe(false);
  rerender({ open: true });
  expect(result.current).toEqual({ mounted: true, state: "open" });
  rerender({ open: false });
  expect(result.current).toEqual({ mounted: true, state: "closed" });
  act(() => jest.advanceTimersByTime(100));
  rerender({ open: true });
  act(() => jest.advanceTimersByTime(OVERLAY_EXIT_MS));
  expect(result.current.mounted).toBe(true);
  rerender({ open: false });
  act(() => jest.advanceTimersByTime(OVERLAY_EXIT_MS));
  expect(result.current.mounted).toBe(false);
});
it("modal chỉ gọi đóng một lần sau khi hết animation", () => {
  const onClose = jest.fn();
  const { result } = renderHook(() => useAnimatedClose(onClose));
  act(() => {
    result.current.close();
    result.current.close();
  });
  expect(result.current.closing).toBe(true);
  expect(onClose).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(OVERLAY_EXIT_MS));
  expect(onClose).toHaveBeenCalledTimes(1);
});
it("không trì hoãn đóng khi người dùng giảm chuyển động", () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  const onClose = jest.fn();
  const { result } = renderHook(() => useAnimatedClose(onClose));
  act(() => result.current.close());
  expect(onClose).toHaveBeenCalledTimes(1);
});
it("hủy callback đóng nếu component đã được gỡ bởi điều hướng", () => {
  const onClose = jest.fn();
  const { result, unmount } = renderHook(() => useAnimatedClose(onClose));
  act(() => result.current.close());
  unmount();
  act(() => jest.runAllTimers());
  expect(onClose).not.toHaveBeenCalled();
});
