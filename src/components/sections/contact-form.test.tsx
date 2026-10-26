import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "./contact-form";
import { submitContactForm } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("@/lib/api/contact", () => ({
  submitContactForm: jest.fn(),
}));

const submitMock = submitContactForm as jest.MockedFunction<
  typeof submitContactForm
>;
const copy = (viDictionary as unknown as Dictionary).contactForm;

function renderForm() {
  return render(<ContactForm copy={copy} />);
}
function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/họ.*tên/i), {
    target: { value: "Nguyễn Văn A" },
  });
  fireEvent.change(screen.getByLabelText(/điện thoại/i), {
    target: { value: "0901 234 567" },
  });
  fireEvent.change(screen.getByLabelText(/nội dung cần trao đổi/i), {
    target: { value: "tu-van-du-an" },
  });
  fireEvent.change(screen.getByLabelText(/mô tả|nội dung yêu cầu|lời nhắn/i), {
    target: { value: "Tôi muốn được tư vấn về dự án Hưng Phú." },
  });
}
beforeEach(() => {
  submitMock.mockReset();
});
describe("ContactForm", () => {
  it("khớp trần @MaxLength backend (→3): name 120 / phone 30 / email 200 / message 5000", () => {
    renderForm();
    expect(screen.getByLabelText(/họ.*tên/i)).toHaveAttribute(
      "maxlength",
      "120",
    );
    expect(screen.getByLabelText(/điện thoại/i)).toHaveAttribute(
      "maxlength",
      "30",
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("maxlength", "200");
    expect(
      screen.getByLabelText(/mô tả|nội dung yêu cầu|lời nhắn/i),
    ).toHaveAttribute("maxlength", "5000");
  });
  it("submit form trống → báo lỗi từng field, KHÔNG gọi API", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /gửi yêu cầu/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/vui lòng nhập họ tên/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/số điện thoại chưa đúng/i)).toBeInTheDocument();
    expect(submitMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/họ.*tên/i)).toHaveFocus();
    expect(screen.getByLabelText(/họ.*tên/i)).toHaveAttribute("aria-describedby", "contact-name-error");
  });
  it("gửi hợp lệ → gọi API với phone đã chuẩn hóa, hiện màn hình thành công", async () => {
    submitMock.mockResolvedValueOnce({} as never);
    renderForm();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /gửi yêu cầu/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/đã gửi yêu cầu thành công/i),
      ).toBeInTheDocument();
    });
    expect(submitMock).toHaveBeenCalledWith({
      name: "Nguyễn Văn A",
      phone: "0901234567", // khoảng trắng/./- bị loại trước khi gửi
      email: undefined, // email trống → không gửi field
      inquiryType: "tu-van-du-an",
      message: "Tôi muốn được tư vấn về dự án Hưng Phú.",
    });
  });
  it("khóa ô nhập và nút gửi trong khi chờ phản hồi API", async () => {
    let finish!: () => void;
    submitMock.mockImplementationOnce(() => new Promise((resolve) => {
      finish = () => resolve({} as never);
    }));
    renderForm();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /gửi yêu cầu/i }));
    expect(screen.getByLabelText(/họ.*tên/i)).toBeDisabled();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("button", { name: copy.submitting })).toBeDisabled();
    finish();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(copy.successTitle));
  });
  it("honeypot có giá trị → giả lập thành công, KHÔNG gọi API", async () => {
    renderForm();
    fillValidForm();
    fireEvent.change(screen.getByLabelText("Công ty"), {
      target: { value: "bot điền" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gửi yêu cầu/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/đã gửi yêu cầu thành công/i),
      ).toBeInTheDocument();
    });
    expect(submitMock).not.toHaveBeenCalled();
  });
  it("API trả TOO_MANY_REQUESTS → hiện thông báo rate-limit, form giữ nguyên", async () => {
    submitMock.mockRejectedValueOnce(
      new ApiError("TOO_MANY_REQUESTS", "Too many requests", 429),
    );
    renderForm();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /gửi yêu cầu/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /gửi quá nhiều yêu cầu/i,
      );
    });
    expect(
      screen.queryByText(/đã gửi yêu cầu thành công/i),
    ).not.toBeInTheDocument();
  });
});
