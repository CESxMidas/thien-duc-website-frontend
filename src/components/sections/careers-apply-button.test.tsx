import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CareersApplyButton } from "./careers-apply-button";
import { submitJobApplication } from "@/lib/api/careers";
import { ApiError } from "@/lib/api/client";

jest.mock("@/lib/api/careers", () => ({ submitJobApplication: jest.fn() }));
const submitMock = jest.mocked(submitJobApplication);
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
beforeEach(() => submitMock.mockReset());
function open() {
  render(
    <CareersApplyButton
      position={{ id: "job-engineer", title: "Kỹ sư xây dựng" }}
      locale="vi"
      label="Ứng tuyển vị trí này"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /Ứng tuyển vị trí này/ }));
}
function fill() {
  fireEvent.change(screen.getByLabelText(/Họ và tên/), {
    target: { value: "Nguyễn Văn A" },
  });
  fireEvent.change(screen.getByLabelText(/Số điện thoại/), {
    target: { value: "0901 234 567" },
  });
  fireEvent.change(screen.getByLabelText(/Email/), {
    target: { value: "a@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Link CV/), {
    target: { value: "https://example.com/cv" },
  });
}
it("mở đúng vị trí và chặn hồ sơ thiếu thông tin", () => {
  open();
  expect(screen.getByRole("dialog")).toHaveAccessibleName(
    "Ứng tuyển: Kỹ sư xây dựng",
  );
  fireEvent.click(screen.getByRole("button", { name: "Gửi hồ sơ" }));
  expect(submitMock).not.toHaveBeenCalled();
  expect(screen.getByText(/Cần tải file PDF/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Họ và tên/)).toHaveFocus();
});
it("gửi theo ID vị trí, chuẩn hóa điện thoại, chỉ xác nhận sau khi API nhận", async () => {
  submitMock.mockResolvedValue({ id: "lead1", received: true });
  open();
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Gửi hồ sơ" }));
  await screen.findByRole("status");
  expect(submitMock).toHaveBeenCalledTimes(1);
  const [positionId, data] = submitMock.mock.calls[0];
  expect(positionId).toBe("job-engineer");
  expect(data.get("phone")).toBe("0901234567");
  expect(data.get("cvLink")).toBe("https://example.com/cv");
  expect(data.has("cv")).toBe(false);
});
it("lỗi API giữ dữ liệu để thử lại và cho biết vị trí đã đóng", async () => {
  submitMock.mockRejectedValue(new ApiError("NOT_FOUND", "Closed", 404));
  open();
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Gửi hồ sơ" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "ngừng nhận hồ sơ",
  );
  expect(screen.getByLabelText(/Họ và tên/)).toHaveValue("Nguyễn Văn A");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
it("không gửi hai lần khi bấm liên tục và khóa nút đóng khi gửi", async () => {
  let resolve!: (value: { received: boolean }) => void;
  submitMock.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  open();
  fill();
  const button = screen.getByRole("button", { name: "Gửi hồ sơ" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(submitMock).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Đóng" })).toBeDisabled();
  resolve({ received: true });
  await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
});
it.each(["javascript:alert(1)", "https://user:secret@example.com/cv"])(
  "chặn link CV không an toàn %s",
  (link) => {
    open();
    fill();
    fireEvent.change(screen.getByLabelText(/Link CV/), {
      target: { value: link },
    });
    fireEvent.click(screen.getByRole("button", { name: "Gửi hồ sơ" }));
    expect(submitMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Link CV phải dùng HTTPS/)).toBeInTheDocument();
  },
);
