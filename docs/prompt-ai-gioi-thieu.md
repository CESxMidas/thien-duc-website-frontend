# Trang giới thiệu Thiên Đức

File này chỉ dùng cho **task chi tiết trang giới thiệu**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## KẾT QUẢ CẬP NHẬT TRANG GIỚI THIỆU - 2026-06-04

**Kết luận:** Stack Giới thiệu đã qua mức hoàn thiện chính. Route `/gioi-thieu` hiện có metadata riêng, data `src/data/about.ts`, PageHeading production, section tổng quan, nguyên tắc/tầm nhìn, lĩnh vực hoạt động, năng lực & hợp tác, CTA liên hệ và hình ảnh minh họa bằng `next/image`.

### Đã hoàn thành

- Thay placeholder không dấu bằng copy tiếng Việt có dấu.
- Thêm metadata riêng cho `/gioi-thieu`.
- Tạo `src/data/about.ts` để quản lý nội dung giới thiệu.
- Bổ sung các section nội dung chính theo đúng prompt.
- CTA dùng route thật `/du-an` và `/lien-he`, thông tin liên hệ dùng `siteConfig`.
- `npm run lint` PASS và `npm run build` PASS trong lượt kiểm tra 2026-06-04.

### Còn lưu ý

- Nội dung giới thiệu vẫn cần công ty duyệt lần cuối trước production.
- Hình minh họa hiện dùng ảnh dự án có sẵn; có thể thay bằng ảnh văn phòng/đội ngũ nếu có dữ liệu thật.

## KẾT QUẢ KIỂM TRA TRANG GIỚI THIỆU - 2026-06-03

**Phạm vi kiểm tra:** chỉ route `/gioi-thieu`, hiện nằm ở `src/app/gioi-thieu/page.tsx`. Đọc tham chiếu thêm `src/components/ui/page-heading.tsx`, `src/config/site.ts`, `src/lib/routes.ts`, `src/data/navigation.ts`, `src/data/home.ts`.

**Kết luận:** Trang giới thiệu hiện mới là placeholder rất ngắn, chỉ có `SiteShell` và `PageHeading`. Nội dung còn tiếng Việt không dấu, chưa có metadata riêng, chưa có section giới thiệu doanh nghiệp, lịch sử, tầm nhìn, lĩnh vực hoạt động, năng lực, giá trị cốt lõi, CTA hoặc hình ảnh minh họa. Đây là trang cần làm tiếp sau Home.

### Đã có sẵn

- Route `/gioi-thieu` đã tồn tại tại `src/app/gioi-thieu/page.tsx`.
- Header/navigation đã có link "Giới thiệu" trỏ đến `/gioi-thieu`.
- `PageHeading` đã có style cơ bản cho eyebrow, H1 và mô tả.
- `siteConfig` đã có tên công ty, email, phone, address để tái sử dụng.
- Home đã có copy nền tảng về Thiên Đức trong `src/data/home.ts`, có thể dùng làm tham chiếu để giữ giọng văn nhất quán.

### Còn thiếu / cần xử lý

- Thay placeholder không dấu:
  - `Gioi thieu`
  - `Tong quan ve Cong ty Thien Duc`
  - `Trang nay se trinh bay...`
- Thêm metadata riêng cho trang giới thiệu.
- Viết copy production bằng tiếng Việt có dấu, chuyên nghiệp, tránh bịa số liệu chưa được duyệt.
- Bổ sung nội dung chính:
  - Tổng quan công ty.
  - Lịch sử hình thành từ năm 2010.
  - Tầm nhìn, sứ mệnh, giá trị cốt lõi.
  - Lĩnh vực hoạt động chính.
  - Năng lực triển khai và định hướng hợp tác.
  - CTA dẫn đến `/du-an` và `/lien-he`.
- Cân nhắc tạo `src/data/about.ts` nếu nội dung dài hoặc cần tái sử dụng.
- Kiểm tra responsive mobile/tablet/desktop sau khi triển khai.
- Chạy `npm run build` sau khi sửa code.

### TASK làm tiếp

```text
TASK: Hoàn thiện trang giới thiệu `/gioi-thieu` ở mức production: thay toàn bộ placeholder không dấu bằng nội dung tiếng Việt có dấu, thêm metadata riêng, xây dựng các section giới thiệu công ty Thiên Đức gồm tổng quan, lịch sử hình thành 2010, tầm nhìn/sứ mệnh/giá trị cốt lõi, lĩnh vực hoạt động, năng lực triển khai và CTA đến Dự án/Liên hệ. Có thể tạo `src/data/about.ts` nếu cần quản lý copy. Không sửa header/footer/toàn site trừ khi bắt buộc để trang hoạt động đúng. Chạy `npm run build` sau khi hoàn tất.
```

---

## PROMPT

```text
PHẠM VI - CHỈ TRANG GIỚI THIỆU

- Route: src/app/gioi-thieu/page.tsx
- Component dùng chung: src/components/ui/page-heading.tsx
- Data có thể tạo mới: src/data/about.ts
- Đọc tham chiếu: src/config/site.ts, src/lib/routes.ts, src/data/navigation.ts, src/data/home.ts, src/app/page.tsx
- KHÔNG refactor header/footer/toàn site trừ khi TASK yêu cầu rõ
- KHÔNG sửa trang Home, Dự án, Tin tức, Liên hệ trong task này

STACK & KỸ THUẬT

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- page.tsx là Server Component
- Import dùng alias: @/components, @/data, @/config, @/lib
- Dùng Link từ next/link cho CTA nội bộ
- Dùng next/image nếu thêm ảnh thật từ /public/images
- Nội dung liên hệ lấy từ siteConfig, không hardcode lệch với header/footer
- Giữ diff gọn, ưu tiên pattern hiện có
- Chạy npm run build sau khi hoàn thiện

Design system tham chiếu:
- Primary #B06613, hover #7f4b0d
- Accent #fdcd04
- Nền shell #f6f3ee hoặc trắng theo layout hiện có
- Card trắng, border black/10, shadow nhẹ nếu cần
- Text #1d2428 / #191919, muted #59646a
- Eyebrow uppercase tracking-[0.24em]
- Section max-width tương tự Home: mx-auto max-w-7xl px-6

TRẠNG THÁI CODE HIỆN TẠI

1. src/app/gioi-thieu/page.tsx hiện chỉ render SiteShell + PageHeading.
2. Nội dung hiện tại còn placeholder không dấu:
   - eyebrow="Gioi thieu"
   - title="Tong quan ve Cong ty Thien Duc"
   - description="Trang nay se trinh bay lich su hinh thanh, tam nhin, linh vuc hoat dong va nang luc doanh nghiep."
3. Chưa có export metadata riêng cho trang /gioi-thieu.
4. Chưa có data riêng cho About.
5. Chưa có section nội dung production hoặc CTA.

LOGIC NỘI DUNG PRODUCTION

- Ngôn ngữ: tiếng Việt có dấu.
- Tone: chuyên nghiệp, tin cậy, phù hợp lĩnh vực đầu tư, xây dựng, phát triển bất động sản.
- Trang Giới thiệu là nơi trình bày rõ Thiên Đức là ai, làm gì, định hướng gì, khác Home vì đi sâu hơn vào doanh nghiệp.
- Không bịa số liệu pháp lý, vốn điều lệ, giấy phép, số dự án, doanh thu, giải thưởng khi chưa có dữ liệu duyệt.
- Có thể dùng năm thành lập 2010 vì đã xuất hiện trong copy Home.
- Có thể dùng phương châm công ty: "Khách hàng hài lòng - Thiên Đức thành công".
- Mỗi trang chỉ có một H1.
- CTA phải dẫn đến route có thật: /du-an và /lien-he.

THỨ TỰ SECTION MỤC TIÊU

1. Page heading / Hero giới thiệu
   - Eyebrow: Giới thiệu
   - H1: Tổng quan về Công ty Thiên Đức
   - Description: Tóm tắt vai trò của Thiên Đức trong đầu tư, xây dựng, thương mại và phát triển bất động sản.

2. Tổng quan doanh nghiệp
   - Nêu tên đầy đủ: Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức.
   - Nêu năm thành lập 2010.
   - Nêu lĩnh vực hoạt động: đầu tư, xây dựng, thương mại, phát triển bất động sản.
   - Nêu địa bàn hoạt động theo copy hiện có: TP.HCM và các tỉnh.
   - Không viết quá quảng cáo, tránh cam kết lợi nhuận hoặc pháp lý chưa duyệt.

3. Tầm nhìn / Sứ mệnh / Giá trị cốt lõi
   - Tầm nhìn: phát triển các không gian sống và dự án có giá trị sử dụng lâu dài.
   - Sứ mệnh: đồng hành cùng khách hàng, đối tác và cộng đồng qua dự án minh bạch, chất lượng.
   - Giá trị cốt lõi gợi ý: Uy tín, minh bạch, chất lượng, hợp tác bền vững.

4. Lĩnh vực hoạt động
   - Đầu tư và phát triển dự án bất động sản.
   - Xây dựng và triển khai hạ tầng/công trình.
   - Hợp tác phát triển dự án.
   - Thương mại và phân phối sản phẩm dự án nếu đúng mô hình công ty.

5. Năng lực và định hướng hợp tác
   - Tập trung vào tiến độ, chất lượng triển khai, phối hợp đối tác.
   - Nhấn mạnh cách tiếp cận thận trọng, minh bạch, hướng đến giá trị dài hạn.
   - Có thể liên kết sang /du-an để người dùng xem dự án tiêu biểu.

6. CTA cuối trang
   - Title: Kết nối với Thiên Đức
   - Description: Mời khách hàng/đối tác trao đổi về dự án, hợp tác hoặc nhu cầu tư vấn.
   - CTA chính: Xem dự án -> /du-an
   - CTA phụ: Liên hệ -> /lien-he
   - Hiển thị phone/email/address từ siteConfig nếu layout phù hợp.

COPY MẪU

SEO:
title: "Giới thiệu Công ty Thiên Đức | Đầu tư, xây dựng & bất động sản"
description: "Tổng quan về Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức, doanh nghiệp hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản từ năm 2010."

Hero:
Eyebrow: Giới thiệu
H1: Tổng quan về Công ty Thiên Đức
Description: Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức được thành lập năm 2010, hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản tại TP.HCM và các tỉnh.

Tổng quan:
"Với định hướng phát triển thận trọng và bền vững, Thiên Đức tập trung vào các dự án có quy hoạch rõ ràng, chất lượng triển khai ổn định và giá trị sử dụng lâu dài. Doanh nghiệp xem uy tín, tiến độ và sự hài lòng của khách hàng là nền tảng cho mỗi hoạt động đầu tư, hợp tác và phát triển dự án."

Phương châm:
"Khách hàng hài lòng - Thiên Đức thành công"

CHECKLIST TRIỂN KHAI

- [ ] Đọc docs/prompt-ai-tong-web.md và docs/prompt-ai-trang-chu.md trước khi sửa.
- [ ] Đọc hướng dẫn Next.js trong node_modules/next/dist/docs/ liên quan metadata/page nếu cần đổi API.
- [ ] Thêm metadata riêng cho src/app/gioi-thieu/page.tsx.
- [ ] Thay placeholder không dấu bằng copy production.
- [ ] Bổ sung section nội dung theo thứ tự mục tiêu.
- [ ] Dùng siteConfig/routes cho liên hệ và link nội bộ.
- [ ] Không bịa dữ liệu chưa được duyệt.
- [ ] Kiểm tra responsive bằng mắt hoặc browser nếu có dev server.
- [ ] Chạy npm run build.

ĐẦU RA MONG ĐỢI

1. Danh sách file đã sửa/tạo.
2. Tóm tắt nội dung production đã đưa vào trang.
3. Ghi chú rõ dữ liệu nào còn cần công ty duyệt.
4. Kết quả kiểm tra build.
```

