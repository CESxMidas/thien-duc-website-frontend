export const siteConfig = {
  name: "Công ty Thiên Đức",
  shortName: "Thiên Đức",
  description: "Website giới thiệu công ty, dự án và tin tức của Thiên Đức.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "dautuxaydungthienduc@yahoo.com",
  phone: "(028) 3740 7188",
  address: "Số 10 Trần Não, Khu Phố 5, Phường An Phú, TP Thủ Đức, TP.HCM",
};

/**
 * Thông tin đăng ký kinh doanh (câu 8 trong `docs/CAU-HOI-CAN-XAC-NHAN.md`).
 * Hiển thị ở chân trang — website doanh nghiệp cần công khai MST và tên pháp nhân.
 */
export const legalInfo = {
  legalName: "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
  taxCode: "0309910290",
  licenseDate: "02/04/2010",
  operatingSince: "05/04/2010",
  authority: "Cục Thuế Thành phố Hồ Chí Minh",
  companyType: "Công ty TNHH hai thành viên trở lên",
  mainBusiness: "Xây dựng nhà các loại (mã ngành 4100)",
};

export const brandColors = {
  primary: "#B06613",
  primarySoft: "#c99248",
  primarySoftInner: "#fff4cf",
  primaryDark: "#B06613",
  primaryDarker: "#7f4b0d",
  accent: "#fdcd04",
  background: "#FFFFFF",
  surface: "#F2F2F2",
  text: "#191919",
  muted: "#8f8f8f",
};
