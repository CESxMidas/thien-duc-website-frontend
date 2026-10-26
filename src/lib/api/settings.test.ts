import { apiFetch } from "./client";
import { companyAddress, getCompanyContact } from "./settings";
import { companyContactFixture } from "@/test-support/company-contact";

jest.mock("./client", () => ({ apiFetch: jest.fn() }));
const fetchMock = jest.mocked(apiFetch);

describe("Thông tin công ty từ CMS", () => {
  beforeEach(() => fetchMock.mockReset());
  it("đọc API thật với thời hạn cache, trả nguyên thông tin đã lưu", async () => {
    const saved = {
      ...companyContactFixture,
      phone: "028 1234 5678",
      email: "contact@thienduc.vn",
    };
    fetchMock.mockResolvedValue(saved);
    expect(await getCompanyContact()).toEqual(saved);
    expect(fetchMock).toHaveBeenCalledWith("/settings/company-contact", {
      next: { revalidate: 60 },
    });
  });
  it("không âm thầm dùng thông tin cũ khi API lỗi", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    await expect(getCompanyContact()).rejects.toThrow("offline");
  });
  it("đọc đúng ngôn ngữ và dùng VI khi EN chưa nhập", () => {
    expect(companyAddress(companyContactFixture, "en")).toBe(
      companyContactFixture.address.en,
    );
    expect(
      companyAddress(
        { ...companyContactFixture, address: { vi: "Địa chỉ mới", en: " " } },
        "en",
      ),
    ).toBe("Địa chỉ mới");
  });
});
