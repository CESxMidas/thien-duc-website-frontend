/**
 * Hệ sinh thái Thiên Đức (câu 6 trong `docs/CAU-HOI-CAN-XAC-NHAN.md`).
 *
 * Công ty chỉ cung cấp **tên pháp nhân** và người đại diện — chưa có mã số thuế,
 * địa chỉ hay mô tả ngành nghề của từng đơn vị. Không tự suy diễn những field đó.
 */

export type MemberCompany = {
  name: string;
  /** Ghi chú ngắn khi đơn vị có quan hệ đặc biệt với công ty mẹ. */
  note?: string;
};

export const legalRepresentative = {
  name: "Trần Hữu Nghị",
  role: "Người đại diện pháp luật",
};

export const memberCompanies: MemberCompany[] = [
  {
    name: "Văn phòng đại diện Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức",
    note: "Văn phòng đại diện của công ty mẹ",
  },
  {
    name: "Công ty TNHH Đầu tư - Dịch vụ - Du lịch Hưng Phú",
  },
  {
    name: "Công ty TNHH Lộc An Phát",
  },
];
