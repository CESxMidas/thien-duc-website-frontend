import type { CompanyContact } from "@/lib/api/settings";

// Dữ liệu kiểm thử độc lập; website luôn đọc cấu hình từ API.
export const companyContactFixture: CompanyContact = {
  phone: "0909 768 001",
  email: "dautuxaydungthienduc@yahoo.com",
  taxCode: "0309910290",
  address: {
    vi: "1D Trần Não, Khu Phố 5, An Khánh, Hồ Chí Minh 71322, Việt Nam",
    en: "1D Tran Nao Street, Quarter 5, An Khanh Ward, Ho Chi Minh City 71322, Vietnam",
  },
};
