import type { CompanyContact } from "@/lib/api/settings";

// Dữ liệu kiểm thử độc lập; website luôn đọc cấu hình từ API.
export const companyContactFixture: CompanyContact = {
  phone: "0909 768 001",
  email: "dautuxaydungthienduc@yahoo.com",
  taxCode: "0309910290",
  address: {
    vi: "Số 10 Trần Não, KP5, P. Bình Trưng, TP. Hồ Chí Minh, Việt Nam",
    en: "No. 10 Tran Nao Street, Quarter 5, Binh Trung Ward, Ho Chi Minh City, Vietnam",
  },
};
